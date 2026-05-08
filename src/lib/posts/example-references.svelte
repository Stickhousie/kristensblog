<script lang="ts" module>
	export const metadata = {
		title: 'Example: Citations and Bibliography',
		date: '2026-01-20',
		description: 'How to add academic citations and a formatted bibliography to a post',
		tags: ['example', 'references']
	};
</script>

<script lang="ts">
	import { ref as r } from '$lib/tags';
	import Bibliography from '$lib/components/Bibliography.svelte';

	let { isAuthenticated = false } = $props();
</script>

<h1>{metadata.title}</h1>

<p>
	This template includes a citation system for academic writing. References are numbered in
	order of first appearance and link to a bibliography section at the end of the post.
</p>

<h2>Basic Usage</h2>

<p>
	Cite a single source with the <code>r</code> tag: Knuth's seminal work {r`knuth1997`} is
	essential reading for any computer scientist. Turing's foundational paper {r`turing1950`}
	asked whether machines can think. Shannon's information theory {r`shannon1948`} underpins
	all of modern communications.
</p>

<p>
	Cite multiple sources at once with a comma-separated list: the transformer architecture
	{r`vaswani2017`} popularised deep learning {r`goodfellow2016`} techniques that are now
	ubiquitous. You can also group citations together: {r`turing1950,shannon1948`}.
</p>

<h2>How It Works</h2>

<p>
	The <code>{`{r\`key\`}`}</code> syntax is a build-time preprocessor tag — import
	<code>ref as r</code> from <code>$lib/tags</code> and the preprocessor replaces it with a
	<code>&lt;Ref&gt;</code> component that renders a numbered superscript link.
</p>

<p>
	The <code>&lt;Bibliography&gt;</code> component at the bottom of the post reads the citation
	order and fetches your JSON reference file. It only renders if at least one citation was used.
</p>

<h2 id="setting-up">Setting Up Your References</h2>

<p>
	Create a JSON file in <code>static/references/</code> (or anywhere under <code>static/</code>)
	with your reference data. Keys are the citation handles you use in <code>{`{r\`key\`}`}</code>.
</p>

<pre><code>{`// static/references/my-post.json
{
  "smith2024": {
    "authors": ["Jane Smith"],
    "title": "My Great Paper",
    "year": 2024,
    "journal": "Nature",
    "volume": "600",
    "pages": "1–10",
    "doi": "10.1038/example"
  }
}`}</code></pre>

<p>Supported fields:</p>
<ul>
	<li><strong>authors</strong> — array of author name strings</li>
	<li><strong>title</strong> — required</li>
	<li><strong>year</strong> — publication year</li>
	<li><strong>journal</strong>, <strong>volume</strong>, <strong>issue</strong>, <strong>pages</strong> — for journal articles</li>
	<li><strong>booktitle</strong>, <strong>pages</strong> — for conference papers</li>
	<li><strong>publisher</strong>, <strong>edition</strong> — for books</li>
	<li><strong>doi</strong>, <strong>arxiv</strong>, <strong>url</strong> — rendered as clickable links</li>
	<li><strong>note</strong> — freeform extra text</li>
</ul>

<p>Then place the <code>&lt;Bibliography&gt;</code> component at the bottom of your post:</p>

<pre><code>{`<Bibliography src="/references/my-post.json" />`}</code></pre>

<Bibliography src="/references/example.json" />
