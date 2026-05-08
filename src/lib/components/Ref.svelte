<script lang="ts">
	import { registerRef } from '$lib/refStore';

	let { keys }: { keys: string | string[] } = $props();

	// registerRef is idempotent (same key always returns same number),
	// so this is safe even though $derived may re-run
	const citations = $derived.by(() => {
		const keyArray = (Array.isArray(keys) ? keys : [keys]).map(k => k.trim());
		return keyArray.map(key => ({
			key,
			num: registerRef(key)
		}));
	});
</script>

<span class="ref-cite">[{#each citations as { key, num }, i}<a
	href="#ref-{key}"
	class="ref-link"
	title="Jump to reference: {key}"
>{num}</a>{#if i < citations.length - 1},&nbsp;{/if}{/each}]</span>

<style>
	.ref-cite {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.ref-link {
		color: var(--color-accent);
		text-decoration: none;
		transition: color 0.15s;
	}

	.ref-link:hover {
		color: var(--color-accent-hover);
		text-decoration: underline;
	}
</style>
