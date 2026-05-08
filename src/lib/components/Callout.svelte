<script lang="ts">
	import type { Snippet } from 'svelte';
	
	type CalloutType = 'info' | 'warning' | 'danger' | 'success' | 'tip' | 'question' | 'quote';
	
	let { type = 'info', title = '', children }: {
		type?: CalloutType;
		title?: string;
		children: Snippet;
	} = $props();
</script>

<aside class="callout {type}">
	{#if title}
		<div class="title">
			{#if type === 'info'}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r="0.5" fill="currentColor"/></svg>
			{:else if type === 'warning'}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
			{:else if type === 'danger'}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
			{:else if type === 'success'}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
			{:else if type === 'tip'}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
			{:else if type === 'question'}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
			{:else if type === 'quote'}
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
			{/if}
			{title}
		</div>
	{/if}
	<div class="content">
		{@render children()}
	</div>
</aside>

<style>
	.callout {
		margin: 1.5rem 0;
		padding: 1rem 1.25rem;
		border-radius: 0 6px 6px 0;
		border-left: 4px solid var(--color-border);
		background-color: var(--color-bg-secondary);
	}
	
	.title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.content :global(p) {
		margin-bottom: 0.5rem;
	}
	
	.content :global(p:last-child) {
		margin-bottom: 0;
	}
	
	.info { border-left-color: var(--color-info); background-color: var(--color-info-bg); }
	.info .title { color: var(--color-info); }
	
	.warning { border-left-color: var(--color-warning); background-color: var(--color-warning-bg); }
	.warning .title { color: var(--color-warning); }
	
	.danger { border-left-color: var(--color-danger); background-color: var(--color-danger-bg); }
	.danger .title { color: var(--color-danger); }
	
	.success { border-left-color: var(--color-success); background-color: var(--color-success-bg); }
	.success .title { color: var(--color-success); }
	
	.tip { border-left-color: var(--color-tip); background-color: var(--color-tip-bg); }
	.tip .title { color: var(--color-tip); }

	.question { border-left-color: var(--color-question); background-color: var(--color-question-bg); }
	.question .title { color: var(--color-question); }

	.quote { border-left-color: var(--color-quote); background-color: var(--color-quote-bg); }
	.quote .title { color: var(--color-quote); }
</style>