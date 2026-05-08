<!-- src/routes/graph/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as d3 from 'd3';
	import type { PageData } from './$types';
	import type { GraphNode, GraphLink } from '$lib/graph';
	
	let { data }: { data: PageData } = $props();
	
	let container: HTMLDivElement;
	let width = $state(800);
	let height = $state(600);
	let currentZoom = $state(1);
	let hoveredNode = $state<GraphNode | null>(null);
	
	const tagColors = d3.scaleOrdinal(d3.schemeTableau10);
	
	onMount(() => {
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
		
		const nodes: GraphNode[] = data.graphData.nodes.map(n => ({ ...n }));
		const links: GraphLink[] = data.graphData.links.map(l => ({ ...l }));
		
		const simulation = d3.forceSimulation(nodes)
			.force('link', d3.forceLink<GraphNode, GraphLink>(links)
				.id(d => d.id)
				.distance(100)
				.strength(d => 0.3 + (d.sharedTags?.length ?? 1) * 0.1)
			)
			.force('charge', d3.forceManyBody().strength(-300))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collision', d3.forceCollide().radius(30));
		
		// Add arrowhead marker definition
		svg.append('defs').append('marker')
			.attr('id', 'arrowhead')
			.attr('markerWidth', 10)
			.attr('markerHeight', 10)
			.attr('refX', 24)
			.attr('refY', 3)
			.attr('orient', 'auto')
			.append('polygon')
			.attr('points', '0 0, 10 3, 0 6')
			.attr('fill', 'var(--color-text-secondary)');
		
		const link = g.append('g')
			.attr('class', 'links')
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke', 'var(--color-text-secondary)')
			.attr('stroke-opacity', 0.4)
			.attr('stroke-width', d => 1 + (d.sharedTags?.length ?? 1) * 0.5)
			.attr('marker-end', 'url(#arrowhead)');
		
		const node = g.append('g')
			.attr('class', 'nodes')
			.selectAll('g')
			.data(nodes)
			.join('g')
			.attr('cursor', 'pointer')
			.call(d3.drag<SVGGElement, GraphNode>()
				.on('start', dragstarted)
				.on('drag', dragged)
				.on('end', dragended)
			);
		
		node.append('circle')
			.attr('r', 8)
			.attr('fill', d => tagColors(d.tags[0] ?? 'untagged'))
			.attr('stroke', 'var(--color-bg)')
			.attr('stroke-width', 2);
		
		node.append('text')
			.text(d => d.title)
			.attr('x', 12)
			.attr('y', 4)
			.attr('class', 'node-label')
			.attr('fill', 'var(--color-text)')
			.attr('font-size', '12px')
			.attr('opacity', 0);
		
		node.on('click', (event, d) => {
			event.stopPropagation();
			goto(`/${d.id}`);
		});
		
		node.on('mouseenter', function(event, d) {
			hoveredNode = d;
			d3.select(this).select('circle')
				.transition()
				.duration(150)
				.attr('r', 12);
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
		
		node.on('mouseleave', function(event, d) {
			hoveredNode = null;
			d3.select(this).select('circle')
				.transition()
				.duration(150)
				.attr('r', 8);
			if (currentZoom < 1.5) {
				d3.select(this).select('text')
					.transition()
					.duration(150)
					.attr('opacity', 0);
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
				.attr('opacity', currentZoom >= 1.5 ? 1 : 0);
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
	
	const tags = $derived(() => {
		const tagSet = new Set<string>();
		for (const node of data.graphData.nodes) {
			for (const tag of node.tags) {
				tagSet.add(tag);
			}
		}
		return Array.from(tagSet).sort();
	});
</script>

<svelte:head>
	<title>Graph</title>
</svelte:head>

<div class="graph-page">
	<header class="graph-header">
		<div class="header-left">
			<a href="/" class="back">← Home</a>
			<h1>Graph View</h1>
		</div>
		<div class="legend">
			{#each tags() as tag}
				<div class="legend-item">
					<span 
						class="legend-dot" 
						style="background-color: {tagColors(tag)}"
					></span>
					<span class="legend-label">{tag}</span>
				</div>
			{/each}
		</div>
	</header>
	
	<div class="graph-container" bind:this={container}></div>
	
	<div class="graph-info">
		{#if hoveredNode}
			<span class="hovered-title">{hoveredNode.title}</span>
			{#if hoveredNode.tags.length > 0}
				<span class="separator">•</span>
				<span>{hoveredNode.tags.join(', ')}</span>
			{/if}
		{:else}
			<span>{data.graphData.nodes.length} posts</span>
			<span class="separator">•</span>
			<span>{data.graphData.links.length} connections</span>
			<span class="separator">•</span>
			<span>Zoom: {Math.round(currentZoom * 100)}%</span>
		{/if}
	</div>
</div>

<style>
	.graph-page {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 60px);
		max-width: none;
		padding: 0;
	}
	
	.graph-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--color-border-muted);
		flex-wrap: wrap;
		gap: 1rem;
	}
	
	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.back {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		text-decoration: none;
	}
	
	.back:hover {
		color: var(--color-accent);
	}
	
	h1 {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		margin: 0;
	}
	
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}
	
	.legend-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
	
	.legend-label {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}
	
	.graph-container {
		flex: 1;
		min-height: 0;
		background: var(--color-bg);
	}
	
	.graph-container :global(svg) {
		display: block;
	}
	
	.graph-container :global(.node-label) {
		pointer-events: none;
		user-select: none;
		font-family: var(--font-body);
	}
	
	.graph-info {
		padding: 0.75rem 1.5rem;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		border-top: 1px solid var(--color-border-muted);
		display: flex;
		gap: 0.5rem;
	}
	
	.separator {
		opacity: 0.5;
	}
	
	.hovered-title {
		color: var(--color-text);
		font-weight: 500;
	}
</style>