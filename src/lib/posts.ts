import type { Component } from 'svelte';

export interface PostMetadata {
	title: string;
	date: string;
	description?: string;
	tags?: string[];
	protected?: boolean;
	links?: string[];
}

export interface Post {
	slug: string;
	metadata: PostMetadata;
	component: Component;
}

const postModules = import.meta.glob<{
	metadata: PostMetadata;
	default: Component;
}>('./posts/*.svelte', { eager: true });

const allPosts: Post[] = Object.entries(postModules)
	.map(([path, module]) => {
		const slug = path.split('/').pop()?.replace('.svelte', '') ?? '';
		return {
			slug,
			metadata: module.metadata,
			component: module.default
		};
	})
	.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());

function filterPosts(posts: Post[], isAuthenticated: boolean): Post[] {
	if (isAuthenticated) return posts;
	return posts.filter(p => !p.metadata.protected);
}

export function getVisiblePosts(isAuthenticated: boolean): Post[] {
	return filterPosts(allPosts, isAuthenticated);
}

export function getPost(slug: string, isAuthenticated: boolean): Post | undefined {
	const post = allPosts.find(p => p.slug === slug);	
	
	if (!post) return undefined;	
	
	if (post.metadata.protected && !isAuthenticated) return undefined;	

	return post;
}

export function getAllPostMetadata(isAuthenticated: boolean): Array<{ slug: string } & PostMetadata> {
	return filterPosts(allPosts, isAuthenticated).map(p => ({
		slug: p.slug,
		...p.metadata
	}));
}

export function getAllTags(isAuthenticated: boolean): Array<{ tag: string; count: number }> {
	const visiblePosts = filterPosts(allPosts, isAuthenticated);
	const tagCounts = new Map<string, number>();	

	for (const post of visiblePosts) {
		for (const tag of post.metadata.tags ?? []) {
			tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
		}
	}
	
	return Array.from(tagCounts.entries())
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// Get posts by tag (only from visible posts)
export function getPostsByTag(tag: string, isAuthenticated: boolean): Array<{ slug: string } & PostMetadata> {
	return filterPosts(allPosts, isAuthenticated)
		.filter(p => p.metadata.tags?.includes(tag))
		.map(p => ({
			slug: p.slug,
			...p.metadata
		}));
}

// Check if a tag exists (in visible posts)
export function tagExists(tag: string, isAuthenticated: boolean): boolean {
	return getAllTags(isAuthenticated).some(t => t.tag === tag);
}