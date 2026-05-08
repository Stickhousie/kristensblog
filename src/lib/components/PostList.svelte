<script lang="ts">
	import Tag from './Tag.svelte';
	import type { PostMetadata } from '$lib/posts';
	
	let { posts, showTags = true }: {
		posts: Array<{ slug: string } & PostMetadata>;
		showTags?: boolean;
	} = $props();
</script>

<ul class="post-list">
	{#each posts as post}
		<li>
			<div class="post-main">
				<a href="/{post.slug}" class="post-link">
					<span class="title">{post.title}</span>
					{#if post.description}
						<span class="desc">{post.description}</span>
					{/if}
				</a>
				<time datetime={post.date}>{post.date}</time>
			</div>
			{#if showTags && post.tags?.length}
				<div class="post-tags">
					{#each post.tags as tag}
						<Tag {tag} size="small" />
					{/each}
				</div>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.post-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	li {
		padding: 1.25rem 0;
		border-bottom: 1px solid var(--color-border-muted);
	}
	
	li:last-child {
		border-bottom: none;
	}
	
	.post-main {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}
	
	.post-link {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		color: var(--color-text);
		text-decoration: none;
		flex: 1;
	}
	
	.post-link:hover .title {
		color: var(--color-accent);
	}
	
	.title {
		font-weight: 500;
		transition: color 0.15s;
	}
	
	.desc {
		font-size: 0.9rem;
		color: var(--color-text-secondary);
	}
	
	time {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-family: var(--font-mono);
		white-space: nowrap;
	}
	
	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}
</style>