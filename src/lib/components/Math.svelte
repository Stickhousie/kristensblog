<script lang="ts">
	import { onMount } from 'svelte';
	
	let { tex, display = false, mathJaxUrl }: {
		tex: string;
		display?: boolean;
		mathJaxUrl?: string;
	} = $props();
	
	let container: HTMLElement;
	let rendered = $state(false);
	
	const defaultUrl = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
	
	onMount(() => {
		loadMathJax().then(() => render());
	});
	
	async function loadMathJax() {
		if (window.MathJax) return;
		
		window.MathJax = {
			tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
			svg: { fontCache: 'global' },
			startup: { typeset: false }
		};
		
		const script = document.createElement('script');
		script.src = mathJaxUrl || defaultUrl;
		script.async = true;
		document.head.appendChild(script);
		
		await new Promise<void>((resolve) => {
			script.onload = () => resolve();
		});
		
		await window.MathJax.startup.promise;
	}
	
	async function render() {
		if (!window.MathJax?.typesetPromise) return;
		const wrapper = display ? `\\[${tex}\\]` : `\\(${tex}\\)`;
		container.innerHTML = wrapper;
		await window.MathJax.typesetPromise([container]);
		rendered = true;
	}
	
	$effect(() => {
		if (rendered && tex) render();
	});
</script>

<svelte:head>
	{#if !rendered}
		<link rel="preconnect" href="https://cdn.jsdelivr.net" />
	{/if}
</svelte:head>

<span
	bind:this={container}
	class:math-inline={!display}
	class:math-display={display}
></span>

<style>
	.math-inline {
		display: inline;
	}
	
	.math-display {
		display: block;
		margin: 1.5rem 0;
		text-align: center;
		overflow-x: auto;
	}
</style>