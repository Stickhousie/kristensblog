<script lang="ts">
	import { resetRefs } from '$lib/refStore';
	import Tag from '$lib/components/Tag.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Reset citation numbering before this article's components are created
	resetRefs();
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
	{#if data.metadata.description}
		<meta name="description" content={data.metadata.description} />
	{/if}
</svelte:head>

<article class="article has-sidenotes">
	<data.component isAuthenticated={data.isAuthenticated} />
	
	{#if data.metadata.tags?.length}
		<footer class="post-footer">
			<div class="tags">
				<span class="tags-label">Tagged:</span>
				{#each data.metadata.tags as tag}
					<Tag {tag} size="small" />
				{/each}
			</div>
		</footer>
	{/if}
</article>

<style>
	.post-footer {
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border-muted);
	}
	
	.tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}
	
	.tags-label {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin-right: 0.25rem;
	}
</style>