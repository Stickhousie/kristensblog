<script>
	import { onMount } from 'svelte';
	
	let { children } = $props();
	
	let buttonRef;
	let noteNum = $state(0);
	let expanded = $state(false);
	let isNarrow = $state(true);
	
	onMount(() => {
		const refs = document.querySelectorAll('.sidenote-ref');
		noteNum = Array.from(refs).indexOf(buttonRef) + 1;  // Find index of THIS button, +1 for 1-based numbering

		
		const checkWidth = () => {
			isNarrow = window.innerWidth < 1200;
		};
		checkWidth();
		window.addEventListener('resize', checkWidth);
		return () => window.removeEventListener('resize', checkWidth);
	});
</script>

<!-- <button class="sidenote-ref" onclick={() => isNarrow && (expanded = !expanded)} aria-expanded={expanded}> -->
<button bind:this={buttonRef} class="sidenote-ref" onclick={() => isNarrow && (expanded = !expanded)} aria-expanded={expanded}>
	{noteNum}
</button>

{#if isNarrow}
	{#if expanded}
		<span class="sidenote-inline">
			<span class="sidenote-num">{noteNum}.</span>
			{@render children()}
		</span>
	{/if}
{:else}
	<span class="sidenote-margin">
		{@render children()}
	</span>
{/if}

<style>
	.sidenote-ref {
		display: inline;
		font-size: 0.75em;
		vertical-align: super;
		line-height: 0;
		color: var(--color-accent);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--font-heading);
	}
	
	.sidenote-ref::before { content: "["; }
	.sidenote-ref::after { content: "]"; }
	
	.sidenote-ref:hover {
		color: var(--color-accent-hover);
	}
	
	/* Narrow screens: inline expandable */
	.sidenote-inline {
		display: block;
		margin: 1rem 0;
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
		background-color: var(--color-bg-secondary);
		border-left: 2px solid var(--color-border);
		border-radius: 0 4px 4px 0;
	}
	
	.sidenote-num {
		font-weight: 600;
		color: var(--color-accent);
		margin-right: 0.25rem;
	}
	
	/* Wide screens: margin positioning */
	.sidenote-margin {
		position: absolute;
		right: 0;
		width: 220px;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}
</style>