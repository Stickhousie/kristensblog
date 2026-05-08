<script lang="ts">
	import '$lib/article.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	
	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<header>
	<nav>
		<a href="/" class="site-name">Blog</a>
		<a href="/tags">Tags</a>
		<a href="/graph">Graph</a>
	</nav>
	<div class="header-right">
		{#if data.isAuthenticated}
			<a href="/api/logout" class="auth-link">Logout</a>
		{:else}
			<a href="/login" class="auth-link">Login</a>
		{/if}
		<ThemeToggle />
	</div>
</header>

{@render children()}

<style>
	header {
		max-width: 42rem;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	nav {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	
	nav a {
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 0.15s;
	}
	
	nav a:hover {
		color: var(--color-text);
	}
	
	.site-name {
		font-family: var(--font-heading);
		font-weight: 700;
		color: var(--color-text);
	}
	
	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.auth-link {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		transition: color 0.15s;
	}
	
	.auth-link:hover {
		color: var(--color-text);
	}
</style>