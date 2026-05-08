<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { path = '' }: { path?: string } = $props();

	let container = $state<HTMLDivElement | undefined>(undefined);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		if (!browser) {
			error = 'This component requires a browser environment';
			loading = false;
			return;
		}

		try {
			// Dynamic import to ensure abcjs only loads on client
			const abcjs = await import('abcjs');

			const response = await fetch(path);
			if (!response.ok) {
				throw new Error(`Failed to load ABC file: ${response.statusText}`);
			}
			const abcContent = await response.text();

			if (!container) {
				throw new Error('Container element not found');
			}

			// Render the ABC notation
			abcjs.renderAbc(container, abcContent, {
				responsive: 'resize',
				staffwidth: 600,
				scale: 1.0
			});

			loading = false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error occurred';
			loading = false;
			console.error('ABC rendering error:', e);
		}
	});
</script>

<div class="abc-container">
	{#if error}
		<div class="error">Error: {error}</div>
	{:else}
		<div bind:this={container} class="abc-sheet-music">
			{#if loading}
				<div class="loading">Loading sheet music...</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.abc-container {
		margin: 1.5rem 0;
		padding: 1.5rem;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		overflow-x: auto;
	}

	.abc-sheet-music {
		width: 100%;
	}

	.abc-sheet-music :global(svg) {
		max-width: 100%;
		height: auto;
	}

	.loading {
		text-align: center;
		padding: 2rem;
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.error {
		color: var(--color-danger);
		padding: 1rem;
		background-color: var(--color-bg-tertiary);
		border-left: 4px solid var(--color-danger);
		border-radius: 4px;
	}
</style>
