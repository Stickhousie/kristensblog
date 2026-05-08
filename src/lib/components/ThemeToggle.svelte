<script lang="ts">
	import { onMount } from 'svelte';
	
	let dark = $state(false);
	
	onMount(() => {
		const stored = localStorage.getItem('theme');
		if (stored) {
			dark = stored === 'dark';
		} else {
			dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		applyTheme();
		
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			if (!localStorage.getItem('theme')) {
				dark = e.matches;
				applyTheme();
			}
		});
	});
	
	function applyTheme() {
		document.documentElement.classList.toggle('dark', dark);
	}
	
	function toggle() {
		dark = !dark;
		localStorage.setItem('theme', dark ? 'dark' : 'light');
		applyTheme();
	}
</script>

<button onclick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
	{#if dark}
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="4"/>
			<path d="M12 2v2"/><path d="M12 20v2"/>
			<path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
			<path d="M2 12h2"/><path d="M20 12h2"/>
			<path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
		</svg>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
		</svg>
	{/if}
</button>

<style>
	button {
		padding: 0.5rem;
		border: none;
		background: transparent;
		border-radius: 0.5rem;
		cursor: pointer;
		color: var(--color-text);
		transition: background-color 0.15s;
	}
	
	button:hover {
		background-color: var(--color-bg-secondary);
	}
	
	svg {
		display: block;
	}
</style>