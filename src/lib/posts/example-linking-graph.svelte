<script lang="ts" module>
	export const metadata = {
		title: 'Post Links and the Knowledge Graph',
		date: '2026-01-11',
		description: 'Creating internal links and visualizing connections between posts.',
		tags: ['features', 'linking']
	};
</script>

<script lang="ts">
	import { link as l } from '$lib/tags';
	import Callout from '$lib/components/Callout.svelte';
	import LocalGraph from '$lib/components/LocalGraph.svelte';

	let { isAuthenticated = false } = $props();
</script>

<h1>{metadata.title}</h1>
<p><time datetime={metadata.date}>{metadata.date}</time></p>

<article>
	<LocalGraph slug="example-linking-graph" {isAuthenticated} />
	<h2>Internal Links Create a Graph</h2>

	<p>
		This blog automatically discovers links between posts and builds an interactive knowledge graph.
		When you visit a post, you'll see a visualization of related posts in the sidebar—a feature
		inspired by tools like Obsidian and Quartz.
	</p>

	<h2>How to Link Posts</h2>

	<p>
		To link to another post from your current post, use the <code>link</code> template tag (imported as <code>l</code>) from <code>$lib/tags</code>:
	</p>

	<pre><code>{`import { link as l } from '$lib/tags';

// In your post:
// See {l\`example-code-blocks\`} for more details.`}</code></pre>

	<p>
		The <code>link</code> tag transforms the slug into a proper HTML anchor at <strong>build time</strong>. 
		This link is type-safe — the preprocessor validates that the target post exists.
	</p>

	<h2>Linking to Specific Sections</h2>

	<p>
		You can link to specific sections within a post using the hash syntax:
	</p>

	<pre><code>{`// Link to the "Getting Started" section of another post
{l\`example-getting-started#using-math-and-links\`}`}</code></pre>

	<p>
		The preprocessor ensures the link is valid at build time. Try linking to {l`example-getting-started#using-math-and-links`} to see how it works.
	</p>

	<h2>The Knowledge Graph Visualization</h2>

	<p>
		Each post includes a <strong>LocalGraph</strong> visualization showing its connected posts. 
		You'll see it above this section showing all posts linked to this one.
	</p>

	<p>
		Navigate to <code>/graph</code> in the navigation to see your entire knowledge graph.
		It shows all posts as nodes and connections (links) between them. You can:
	</p>	

	<ul>
		<li>Hover over nodes to highlight related posts</li>
		<li>Click nodes to navigate to that post</li>
		<li>Pan and zoom to explore the graph</li>
		<li>See the local graph for each post (connected posts only)</li>
	</ul>

	<h2>Building Your Content Network</h2>

	<p>
		The more you link between related posts, the richer your knowledge graph becomes.
		This creates a non-linear way for readers to explore your content. Instead of scrolling
		through chronological lists, they can follow threads of connected ideas through links like {l`example-code-blocks`}, {l`example-math`}, and others.
	</p>

	<Callout type="tip" title="Link Building Strategy">
		<p>
			Think of posts that naturally relate to each other and add forward and backward links.
			For example, an advanced post might link to foundational posts, while foundational posts
			can link to more advanced follow-ups. This creates a web of knowledge.
		</p>
	</Callout>

	<h2>Seeing the Local Graph</h2>

	<p>
		At the bottom of each post (or via the local graph viewer), you'll see a visualization
		of posts linked to the current post. This helps readers understand where this post sits
		in your larger knowledge base.
	</p>

	<h2>No Dead Links</h2>

	<p>
		Since links are validated at compile time from actual posts, you never have to worry about
		broken internal links. If a post doesn't exist, the build will fail with an error message telling you exactly which link is broken.
	</p>

	<Callout type="info" title="Graph Features">
		<p>
			The graph visualization uses D3.js, a powerful data visualization library.
			It automatically positions nodes using force-directed layout, creating an
			intuitive spatial representation of your knowledge network.
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

	pre {
		background: var(--color-bg-secondary);
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	code {
		font-family: var(--font-mono);
		font-size: 0.9em;
	}

	ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	time {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}
</style>
