<script lang="ts">
	import { getAllTags } from '$lib/posts';
	import Tag from '$lib/components/Tag.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
		
</script>

<svelte:head>
	<title>Tags</title>
</svelte:head>

<main>
	<h1>Tags</h1>
	<p class="subtitle">Browse posts by topic</p>
	
	<div class="tags">
		{#each data.tags as { tag, count }}
			<Tag {tag} {count} />
		{/each}
	</div>
	
	{#if data.tags.length === 0}
		<p class="empty">No tags yet.</p>
	{/if}
</main>

<style>
	main {
		max-width: 42rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}
	
	h1 {
		font-family: var(--font-heading);
		font-size: 2rem;
		margin: 0 0 0.5rem 0;
	}
	
	.subtitle {
		color: var(--color-text-secondary);
		margin: 0 0 2rem 0;
	}
	
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	
	.empty {
		color: var(--color-text-secondary);
		font-style: italic;
	}
</style>