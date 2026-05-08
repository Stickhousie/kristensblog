<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Posts tagged "{data.tag}"</title>
</svelte:head>

<main>
	<a href="/tags" class="back">← All tags</a>
	
	<h1>
		<span class="label">Tagged</span>
		{data.tag}
	</h1>
	<p class="count">{data.count} {data.count === 1 ? 'post' : 'posts'}</p>
	
	<PostList posts={data.posts} showTags={false} />
</main>

<style>
	main {
		max-width: 42rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}
	
	.back {
		display: inline-block;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		text-decoration: none;
	}
	
	.back:hover {
		color: var(--color-accent);
	}
	
	h1 {
		font-family: var(--font-heading);
		font-size: 2rem;
		margin: 0 0 0.5rem 0;
	}
	
	.label {
		color: var(--color-text-secondary);
		font-weight: 400;
	}
	
	.count {
		color: var(--color-text-secondary);
		margin: 0 0 2rem 0;
	}
</style>