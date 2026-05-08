<script lang="ts">
	import { onMount } from 'svelte';
	import { getRefOrder } from '$lib/refStore';

	export interface RefData {
		authors?: string[];
		title: string;
		year?: number | string;
		// Journal article fields
		journal?: string;
		volume?: string;
		issue?: string;
		pages?: string;
		// Book fields
		publisher?: string;
		edition?: string;
		// Conference fields
		booktitle?: string;
		// Online/preprint fields
		url?: string;
		doi?: string;
		arxiv?: string;
		// Misc
		note?: string;
	}

	let { src }: { src: string } = $props();

	let refData: Record<string, RefData> = $state({});
	let usedRefs: string[] = $state([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		usedRefs = getRefOrder();

		if (usedRefs.length === 0) {
			loading = false;
			return;
		}

		try {
			const response = await fetch(src);
			if (!response.ok) {
				throw new Error(`Failed to load references: ${response.status} ${response.statusText}`);
			}
			refData = await response.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load references';
			console.error('Bibliography error:', e);
		}
		loading = false;
	});

	function formatAuthors(authors: string[] | undefined): string {
		if (!authors || authors.length === 0) return '';
		if (authors.length === 1) return authors[0];
		if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
		return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`;
	}

	function formatVenue(data: RefData): string {
		const parts: string[] = [];

		if (data.journal) {
			let venue = data.journal;
			if (data.volume) {
				venue += `, ${data.volume}`;
				if (data.issue) venue += `(${data.issue})`;
			}
			if (data.pages) venue += `:${data.pages}`;
			parts.push(venue);
		} else if (data.booktitle) {
			parts.push(`In ${data.booktitle}`);
			if (data.pages) parts.push(`pp. ${data.pages}`);
		} else if (data.publisher) {
			let pub = data.publisher;
			if (data.edition) pub = `${data.edition} ed., ${pub}`;
			parts.push(pub);
		}

		return parts.join(', ');
	}
</script>

{#if usedRefs.length > 0}
	<section class="bibliography">
		<h2>References</h2>

		{#if loading}
			<p class="loading">Loading references...</p>
		{:else if error}
			<p class="error">{error}</p>
		{:else}
			<ol class="ref-list">
				{#each usedRefs as key}
					{@const data = refData[key]}
					<li id="ref-{key}" class="ref-entry">
						{#if data}
							{@const venue = formatVenue(data)}
							<span class="ref-content">
								{#if data.authors}
									<span class="ref-authors">{formatAuthors(data.authors)}</span>
								{/if}
								{#if data.year}
									<span class="ref-year">({data.year})</span>
								{/if}
								<span class="ref-title">"{data.title}"</span>
								{#if venue}
									<span class="ref-venue">{venue}.</span>
								{/if}
								{#if data.note}
									<span class="ref-note">{data.note}</span>
								{/if}
							</span>
							<span class="ref-links">
								{#if data.url}
									<a href={data.url} target="_blank" rel="noopener noreferrer" class="ref-link-external">[link]</a>
								{/if}
								{#if data.doi}
									<a href="https://doi.org/{data.doi}" target="_blank" rel="noopener noreferrer" class="ref-link-external">[doi]</a>
								{/if}
								{#if data.arxiv}
									<a href="https://arxiv.org/abs/{data.arxiv}" target="_blank" rel="noopener noreferrer" class="ref-link-external">[arXiv]</a>
								{/if}
							</span>
						{:else}
							<span class="ref-missing">
								Reference "<code>{key}</code>" not found in <code>{src}</code>
							</span>
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	</section>
{/if}

<style>
	.bibliography {
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border-muted);
	}

	.bibliography h2 {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		margin: 0 0 1.5rem 0;
	}

	.ref-list {
		list-style: none;
		padding: 0;
		margin: 0;
		counter-reset: ref-counter;
	}

	.ref-entry {
		position: relative;
		padding-left: 2.5rem;
		margin-bottom: 1rem;
		line-height: 1.6;
		counter-increment: ref-counter;
	}

	.ref-entry::before {
		content: "[" counter(ref-counter) "]";
		position: absolute;
		left: 0;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.ref-content {
		display: inline;
	}

	.ref-authors {
		font-weight: 500;
	}

	.ref-authors::after {
		content: " ";
	}

	.ref-year {
		color: var(--color-text-secondary);
	}

	.ref-year::after {
		content: ". ";
	}

	.ref-title {
		font-style: italic;
	}

	.ref-title::after {
		content: " ";
	}

	.ref-venue {
		color: var(--color-text-secondary);
	}

	.ref-note {
		color: var(--color-text-tertiary);
		font-size: 0.9em;
	}

	.ref-note::before {
		content: " — ";
	}

	.ref-links {
		display: inline;
		margin-left: 0.5rem;
	}

	.ref-link-external {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-accent);
		text-decoration: none;
		margin-right: 0.25rem;
	}

	.ref-link-external:hover {
		text-decoration: underline;
	}

	.ref-missing {
		color: var(--color-danger);
		font-style: italic;
	}

	.ref-missing code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		background: var(--color-danger-bg);
		padding: 0.1em 0.3em;
		border-radius: 3px;
	}

	.loading {
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.error {
		color: var(--color-danger);
	}
</style>
