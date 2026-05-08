<script lang="ts">
	let { tag, count, size = 'normal' }: {
		tag: string;
		count?: number;
		size?: 'small' | 'normal';
	} = $props();
</script>

<a href="/tags/{tag}" class="tag {size}">
	{tag}
	{#if count !== undefined}
		<span class="count">{count}</span>
	{/if}
</a>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.625rem;
		font-size: 0.8125rem;
		font-family: var(--font-mono);
		color: var(--color-text-secondary);
		background-color: var(--color-bg-secondary);
		border-radius: 4px;
		text-decoration: none;
		transition: background-color 0.15s, color 0.15s;
	}
	
	.tag:hover {
		background-color: var(--color-bg-tertiary);
		color: var(--color-text);
	}
	
	.tag.small {
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
	}
	
	.count {
		padding: 0.0625rem 0.375rem;
		font-size: 0.6875rem;
		background-color: var(--color-bg-tertiary);
		border-radius: 3px;
	}
	
	.tag:hover .count {
		background-color: var(--color-bg-secondary);
	}
</style>