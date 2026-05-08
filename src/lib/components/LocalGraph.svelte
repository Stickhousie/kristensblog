<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as d3 from 'd3';
	import { getAllPostMetadata } from '$lib/posts';
	import { buildGraphData, type GraphNode, type GraphLink } from '$lib/graph';

	let { slug, isAuthenticated = false }: { slug: string; isAuthenticated?: boolean } = $props();

	let container: HTMLDivElement;
	let width = $state(600);
	let height = $state(400);
	let currentZoom = $state(1);
	let hoveredNode = $state<GraphNode | null>(null);

	const tagColors = d3.scaleOrdinal(d3.schemeTableau10);

	onMount(async () => {
		// Get all posts and build graph
		const allPosts = getAllPostMetadata(isAuthenticated);
		const fullGraphData = buildGraphData(allPosts);

		// Find the current post node
		const currentNode = fullGraphData.nodes.find(n => n.id === slug);
		if (!currentNode) {
			console.warn(`Post "${slug}" not found in graph`);
			return;
		}

		// Build local graph with only adjacent nodes
		const connectedNodeIds = new Set<string>();
		connectedNodeIds.add(slug); // Include current node

		// Find all nodes connected to the current node
		const adjacentLinks = fullGraphData.links.filter(
			link => link.source === slug || link.target === slug
		);

		adjacentLinks.forEach(link => {
			connectedNodeIds.add(link.source as string);
			connectedNodeIds.add(link.target as string);
		});

		// Filter nodes and links to only include connected ones
		const localNodes = fullGraphData.nodes.filter(n => connectedNodeIds.has(n.id)).map(n => ({ ...n }));
		const localLinks = adjacentLinks.map(l => ({ ...l }));

		const rect = container.getBoundingClientRect();
		width = rect.width;
		height = rect.height;

		const svg = d3.select(container)
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('viewBox', [0, 0, width, height]);

		const g = svg.append('g');

		const zoom = d3.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.1, 4])
			.on('zoom', (event) => {
				g.attr('transform', event.transform);
				currentZoom = event.transform.k;
				updateLabels();
			});

		svg.call(zoom);

		const simulation = d3.forceSimulation(localNodes)
			.force('link', d3.forceLink<GraphNode, GraphLink>(localLinks)
				.id(d => d.id)
				.distance(80)
				.strength(d => 0.5)
			)
			.force('charge', d3.forceManyBody().strength(-200))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collision', d3.forceCollide().radius(25));

		// Draw links
		const link = g.append('g')
			.attr('class', 'links')
			.selectAll('line')
			.data(localLinks)
			.join('line')
			.attr('stroke', 'var(--color-text-secondary)')
			.attr('stroke-opacity', 0.4)
			.attr('stroke-width', 1.5)
			.attr('marker-end', 'url(#arrowhead)');

		// Add arrowhead marker
		svg.append('defs').append('marker')
			.attr('id', 'arrowhead')
			.attr('markerWidth', 10)
			.attr('markerHeight', 10)
			.attr('refX', 20)
			.attr('refY', 3)
			.attr('orient', 'auto')
			.append('polygon')
			.attr('points', '0 0, 10 3, 0 6')
			.attr('fill', 'var(--color-text-secondary)');

		// Draw nodes
		const node = g.append('g')
			.attr('class', 'nodes')
			.selectAll('g')
			.data(localNodes)
			.join('g')
			.attr('cursor', 'pointer')
			.call(d3.drag<SVGGElement, GraphNode>()
				.on('start', dragstarted)
				.on('drag', dragged)
				.on('end', dragended)
			);

		node.append('circle')
			.attr('r', d => d.id === slug ? 12 : 8)
			.attr('fill', d => tagColors(d.tags[0] ?? 'untagged'))
			.attr('stroke', 'var(--color-bg)')
			.attr('stroke-width', 2)
			.attr('opacity', d => d.id === slug ? 1 : 0.8);

		node.append('text')
			.text(d => d.title)
			.attr('x', 14)
			.attr('y', 4)
			.attr('class', 'node-label')
			.attr('fill', 'var(--color-text)')
			.attr('font-size', '11px')
			.attr('opacity', d => d.id === slug ? 1 : 0);

		node.on('click', (event, d) => {
			event.stopPropagation();
			goto(`/${d.id}`);
		});

		node.on('mouseenter', function (event, d) {
			hoveredNode = d;
			d3.select(this).select('circle')
				.transition()
				.duration(150)
				.attr('r', d.id === slug ? 14 : 12);
			d3.select(this).select('text')
				.transition()
				.duration(150)
				.attr('opacity', 1);

			link.attr('stroke-opacity', l => {
				const src = (l.source as GraphNode).id;
				const tgt = (l.target as GraphNode).id;
				return (src === d.id || tgt === d.id) ? 0.8 : 0.2;
			});
		});

		node.on('mouseleave', function (event, d) {
			hoveredNode = null;
			d3.select(this).select('circle')
				.transition()
				.duration(150)
				.attr('r', d.id === slug ? 12 : 8);
			if (currentZoom < 1.5) {
				d3.select(this).select('text')
					.transition()
					.duration(150)
					.attr('opacity', d.id === slug ? 1 : 0);
			}
			link.attr('stroke-opacity', 0.4);
		});

		simulation.on('tick', () => {
			link
				.attr('x1', d => (d.source as GraphNode).x!)
				.attr('y1', d => (d.source as GraphNode).y!)
				.attr('x2', d => (d.target as GraphNode).x!)
				.attr('y2', d => (d.target as GraphNode).y!);

			node.attr('transform', d => `translate(${d.x},${d.y})`);
		});

		function updateLabels() {
			node.selectAll('text')
				.attr('opacity', (d: any) => {
					if (d.id === slug) return 1; // Always show current node label
					return currentZoom >= 1.5 ? 1 : 0;
				});
		}

		function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}

		function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}

		function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
			if (!event.active) simulation.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;
		}

		svg.call(zoom.transform, d3.zoomIdentity);

		const resizeObserver = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				width = entry.contentRect.width;
				height = entry.contentRect.height;
				svg.attr('viewBox', [0, 0, width, height]);
				simulation.force('center', d3.forceCenter(width / 2, height / 2));
				simulation.alpha(0.3).restart();
			}
		});
		resizeObserver.observe(container);

		return () => {
			resizeObserver.disconnect();
			simulation.stop();
		};
	});
</script>

<div class="local-graph-container" bind:this={container}></div>

<style>
	.local-graph-container {
		width: 100%;
		height: 100%;
		background: var(--color-bg);
	}

	.local-graph-container :global(svg) {
		display: block;
	}

	.local-graph-container :global(.node-label) {
		pointer-events: none;
		user-select: none;
		font-family: var(--font-body);
	}
</style>
