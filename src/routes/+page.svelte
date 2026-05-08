<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<main>
	<section class="intro">
		<h1>Welcome to Your Blog</h1>
		<p>This is a SvelteKit blog template. Customize this homepage by editing the intro text, and add your own posts in <code>src/lib/posts/</code>.</p>
		<p>Explore the example posts to learn about all available features: code highlighting, math rendering, sheet music, tags, knowledge graphs, and more.</p>
	</section>
	
	{#if data.tags.length > 0}
		<section class="tags-section">
			<h2>Topics</h2>
			<div class="tags">
				{#each data.tags as { tag, count }}
					<Tag {tag} {count} />
				{/each}
			</div>
		</section>
	{/if}
	
	<section class="posts-section">
		<h2>Recent Posts</h2>
		<PostList posts={data.posts} />
	</section>
</main>

<style>
	main {
		max-width: 42rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}
	
	.intro {
		margin-bottom: 3rem;
	}
	
	.intro h1 {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
	}
	
	.intro p {
		color: var(--color-text-secondary);
		font-size: 1.125rem;
		margin: 0.5rem 0;
		line-height: 1.6;
	}
	
	code {
		background: var(--color-bg-secondary);
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-size: 0.95em;
		font-family: var(--font-mono);
	}
	
	section {
		margin-bottom: 2.5rem;
	}
	
	h2 {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		margin: 0 0 1rem 0;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>