<script lang="ts" module>
	export const metadata = {
		title: 'Sheet Music with ABC Notation',
		date: '2026-01-08',
		description: 'Embedding music notation in ABC format within your blog posts.',
		tags: ['features', 'media', 'music']
	};
</script>

<script lang="ts">
	import ABC from '$lib/components/ABC.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import LocalGraph from '$lib/components/LocalGraph.svelte';

	let { isAuthenticated = false } = $props();
</script>

<h1>{metadata.title}</h1>
<p><time datetime={metadata.date}>{metadata.date}</time></p>

<article>
	<LocalGraph slug="example-sheet-music" {isAuthenticated} />
	<h2>ABC Notation for Music</h2>

	<p>
		The ABC component renders sheet music from ABC notation—a simple, text-based format for 
		representing musical scores. If you compose or work with music, this makes it easy to share 
		your compositions directly in your blog.
	</p>

	<h2>Basic Example</h2>

	<p>
		Here's a simple tune rendered from ABC notation (you would typically load this from a file):
	</p>

	<ABC path="/twelveeightjig.abc" />

	<Callout type="info" title="ABC Files">
		<p>
			ABC files are stored in <code>static/</code>. They are plain text so they are small
			and commit normally — no special setup needed.
		</p>
	</Callout>

	<h2>What is ABC Notation?</h2>

	<p>
		ABC notation is a human-readable, simple text format for representing music. It uses:
	</p>

	<ul>
		<li>Letters (A-G) for notes</li>
		<li>Numbers for octaves and durations</li>
		<li>Symbols for accidentals, rests, and timing</li>
		<li>A header section for metadata (title, composer, etc.)</li>
	</ul>

	<h2>Why Use ABC?</h2>

	<p>
		ABC has several advantages for a blog:
	</p>

	<ul>
		<li><strong>Text-based:</strong> Easy to version control and embed inline if desired</li>
		<li><strong>Readable:</strong> Humans can read ABC notation, not just computers</li>
		<li><strong>Lightweight:</strong> Scores are tiny file sizes</li>
		<li><strong>Folk-friendly:</strong> Popular in folk music communities</li>
		<li><strong>No external services:</strong> Renders client-side using the open-source abcjs library</li>
	</ul>

	<h2>Learning ABC</h2>

	<p>
		To write ABC notation, learn the syntax at the 
		<a href="https://abcnotation.com/">ABC Notation website</a>. 
		It's designed to be simple enough to learn in an afternoon.
	</p>

	<h2>Tools for Creating ABC</h2>

	<p>
		Several tools help you create ABC notation:
	</p>

	<ul>
		<li><strong>ABC Editors:</strong> EasyABC, ABCExplorer for visual editing</li>
		<li><strong>MuseScore:</strong> Export to ABC from this popular notation software</li>
		<li><strong>Text editors:</strong> Write ABC directly—it's just text!</li>
		<li><strong>Online tools:</strong> Many web-based ABC editors are available</li>
	</ul>

	<Callout type="warning" title="ABC Limitations">
		<p>
			ABC notation works best for melody-focused music (like folk tunes). It's less suitable for
			complex piano music or modern classical compositions due to its single-staff nature.
			For more complex scores, consider other formats.
		</p>
	</Callout>

	<h2>Using ABC in Your Posts</h2>

	<p>
		To include sheet music in a post:
	</p>

	<ol>
		<li>Create or obtain an ABC notation file (save as <code>.abc</code>)</li>
		<li>Place it in <code>static/</code> directory</li>
		<li>Use the ABC component: <code>&lt;ABC path="/your-file.abc" /&gt;</code></li>
	</ol>

	<Callout type="tip" title="Pro Tip">
		<p>
			Use ABC for sharing melodies you've written, documenting traditional tunes, or 
			illustrating music theory concepts in your posts. The visual representation combined 
			with text explanations makes music theory much more accessible.
		</p>
	</Callout>
</article>

<style>
	article {
		max-width: 42rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	h2 {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	ol {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	code {
		background: var(--color-bg-secondary);
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-size: 0.9em;
		font-family: var(--font-mono);
	}

	a {
		color: var(--color-accent);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	time {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}
</style>
