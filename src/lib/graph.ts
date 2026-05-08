// src/lib/graph.ts
/**
 * Graph data computation for the force-directed visualization.
 * Nodes are posts, edges connect posts that share tags.
 */

import type { PostMetadata } from './posts';

export interface GraphNode {
	id: string;
	title: string;
	tags: string[];
	protected: boolean;
	x?: number;
	y?: number;
	vx?: number;
	vy?: number;
}

export interface GraphLink {
	source: string;
	target: string;
	sharedTags: string[];
}

export interface GraphData {
	nodes: GraphNode[];
	links: GraphLink[];
}

export function buildGraphData(
	posts: Array<{ slug: string } & PostMetadata>
): GraphData {
	const nodes: GraphNode[] = posts.map(post => ({
		id: post.slug,
		title: post.title,
		tags: post.tags ?? [],
		links: post.links ?? [],
		protected: post.protected ?? false
	}));
	
	const links: GraphLink[] = [];
	const seenLinks = new Set<string>();
	
	// Create directional links based on post.links
	for (const node of nodes) {
		for (const targetId of node.links) {
			// Only create link if target exists in graph
			if (nodes.find(n => n.id === targetId)) {
				const linkKey = `${node.id}->${targetId}`;
				if (!seenLinks.has(linkKey)) {
					seenLinks.add(linkKey);
					links.push({ source: node.id, target: targetId, sharedTags: [] });
				}
			}
		}
	}
	
	return { nodes, links };
}

export function getPrimaryTag(node: GraphNode): string {
	return node.tags[0] ?? 'untagged';
}

export function getAllGraphTags(nodes: GraphNode[]): string[] {
	const tags = new Set<string>();
	for (const node of nodes) {
		for (const tag of node.tags) {
			tags.add(tag);
		}
	}
	return Array.from(tags).sort();
}