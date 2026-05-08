<script lang="ts">
	import { highlight } from '$lib/shiki';
	
	let { lang = 'text', filename = '', code = '' }: {
		lang?: string;
		filename?: string;
		code?: string;
	} = $props();
	
	let normalizedCode = $derived(dedent(code.trim()));
	let highlighted = $derived(highlight(normalizedCode, lang));
	let copied = $state(false);
	
	async function copy() {
		await navigator.clipboard.writeText(normalizedCode);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
	
	function dedent(str: string): string {
		const lines = str.split('\n');
		const indents = lines
			.filter(line => line.trim().length > 0)
			.map(line => line.match(/^(\s*)/)?.[1].length ?? 0);
		const minIndent = Math.min(...indents);
		if (minIndent === 0) return str;
		return lines.map(line => line.slice(minIndent)).join('\n');
	}
</script>

<div class="code-block">
	{#if filename}
		<div class="header">
			<span class="filename">{filename}</span>
			<div class="header-right">
				<span class="lang">{lang}</span>
				<button class="copy-btn" onclick={copy} aria-label="Copy code">
					{#if copied}
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
					{/if}
				</button>
			</div>
		</div>
	{/if}
	
	<div class="code-container">
		{#if !filename}
			<button class="copy-btn floating" onclick={copy} aria-label="Copy code">
				{#if copied}
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
				{/if}
			</button>
		{/if}
		
		{#await highlighted}
			<pre><code>{normalizedCode}</code></pre>
		{:then html}
			<div class="shiki">{@html html}</div>
		{:catch}
			<pre><code>{normalizedCode}</code></pre>
		{/await}
	</div>
</div>

<style>
	.code-block {
		margin: 1.5rem 0;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		overflow: hidden;
	}
	
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		background-color: var(--color-bg-tertiary);
		border-bottom: 1px solid var(--color-border);
	}
	
	.filename {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
	
	.header-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	
	.lang {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-tertiary);
	}
	
	.code-container {
		position: relative;
	}
	
	pre {
		margin: 0;
		padding: 1rem;
		overflow-x: auto;
		background-color: var(--color-code-bg);
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.6;
	}
	
	.shiki :global(pre) {
		margin: 0;
		padding: 1rem;
		overflow-x: auto;
		background-color: var(--color-code-bg) !important;
	}
	
	.shiki :global(code) {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.6;
	}
	
	.shiki :global(span) {
		color: var(--shiki-light);
	}
	
	:global(.dark) .shiki :global(span) {
		color: var(--shiki-dark);
	}
	
	.copy-btn {
		padding: 0.25rem;
		border: none;
		background: transparent;
		border-radius: 4px;
		cursor: pointer;
		color: var(--color-text-secondary);
		transition: color 0.15s, background-color 0.15s;
	}
	
	.copy-btn:hover {
		color: var(--color-text);
		background-color: var(--color-bg-secondary);
	}
	
	.copy-btn.floating {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		padding: 0.375rem;
		background-color: var(--color-bg-tertiary);
		opacity: 0;
		transition: opacity 0.15s;
	}
	
	.code-container:hover .copy-btn.floating {
		opacity: 1;
	}
</style>