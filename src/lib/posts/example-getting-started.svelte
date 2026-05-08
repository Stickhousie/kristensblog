<script lang="ts" module>
	export const metadata = {
		title: 'Getting Started with This Blog Template',
		date: '2026-01-15',
		description: 'An introduction to the features and structure of this Svelte blog template.',
		tags: ['tutorial', 'setup']
	};
</script>

<script lang="ts">
	import { inlineMath as x, displayMath as X, link as l } from '$lib/tags';
	import Callout from '$lib/components/Callout.svelte';
	import Code from '$lib/components/Code.svelte';
	import Sidenote from '$lib/components/Sidenote.svelte';
	import LocalGraph from '$lib/components/LocalGraph.svelte';

	let { isAuthenticated = false } = $props();
</script>

<h1>{metadata.title}</h1>
<p><time datetime={metadata.date}>{metadata.date}</time></p>

<article>
	<LocalGraph slug="example-getting-started" {isAuthenticated} />

	<h2>Welcome to Your Blog</h2>
	
	<p>
		This is a template for creating a modern technical blog using SvelteKit. 
		It comes with many built-in features<Sidenote>See the other example posts to learn about all available features.</Sidenote> 
		to help you write rich, interactive content.
	</p>

	<h2>Key Features</h2>
	
	<ul>
		<li><strong>Syntax-highlighted code blocks</strong> with language detection</li>
		<li><strong>LaTeX math rendering</strong> for mathematical expressions</li>
		<li><strong>Internal links</strong> that create an interactive graph of your posts</li>
		<li><strong>Tags</strong> for organizing and categorizing content</li>
		<li><strong>Dark/light mode</strong> with automatic theme detection</li>
		<li><strong>Password protection</strong> for private posts</li>
		<li><strong>Custom components</strong> for callouts, sidenotes, sheet music, and more</li>
	</ul>

	<h2>How to Create Posts</h2>
	
	<p>
		Posts are Svelte components stored in <code>src/lib/posts/</code>. 
		Each post file should export a <code>metadata</code> object in a module script:
	</p>

	<Code lang="svelte" code={`<script lang="ts" module>
	export const metadata = {
		title: 'Your Post Title',
		date: '2026-01-15',
		description: 'Brief description for listings',
		tags: ['tag1', 'tag2'],
		protected: false
	};
</script>

<script lang="ts">
	import { inlineMath as x, displayMath as X, link as l } from '$lib/tags';
	import Callout from '$lib/components/Callout.svelte';
	import LocalGraph from '$lib/components/LocalGraph.svelte';

	let { isAuthenticated = false } = $props();
</script>

<h1>{metadata.title}</h1>
<LocalGraph slug="your-post-slug" {isAuthenticated} />
<!-- Your post content here -->`} />

	<Callout type="tip" title="Pro Tip">
		<p>
			Post slugs are automatically generated from filenames by removing the 
			<code>.svelte</code> extension. So <code>my-great-post.svelte</code> becomes 
			<code>/my-great-post</code>.
		</p>
	</Callout>

	<h2>Using Math and Links</h2>

	<p>
		This template has a powerful preprocessor that transforms mathematical expressions and links at <strong>build time</strong>. 
		Use template tag syntax:
	</p>

	<ul>
		<li><strong>Inline math:</strong> <code>{`{x\`f(x) = x^2\`}`}</code> renders to {x`f(x) = x^2`}</li>
		<li><strong>Display math:</strong> <code>{`{X\`E = mc^2\`}`}</code> renders centered</li>
		<li><strong>Links to posts:</strong> <code>{`{l\`other-post\`}`}</code> creates an internal link</li>
		<li><strong>Links with anchors:</strong> <code>{`{l\`other-post#section\`}`}</code> links to a specific section</li>
	</ul>

	<p>
		Static expressions (without variables) are rendered at build time as SVG, making your site blazingly fast. 
		For dynamic content with variables, use the <code>&lt;Math&gt;</code> component instead.
	</p>

	<h2>Organizing with Tags</h2>
	
	<p>
		Tags help readers discover related posts. Add as many tags as relevant to your post. 
		The homepage displays all unique tags and their post counts, allowing readers to browse 
		by topic.
	</p>

	<h2>Next Steps</h2>
	
	<p>
		Check out the other example posts to learn about:
	</p>
	<ul>
		<li>Using code components with syntax highlighting</li>
		<li>Rendering mathematical equations</li>
		<li>Adding callouts and sidenotes</li>
		<li>Linking to other posts and building your content graph</li>
		<li>Embedding sheet music with ABC notation</li>
		<li>Adding academic citations and bibliographies</li>
	</ul>

	<Callout type="info" title="Remember">
		<p>
			This is a template meant for <em>your</em> customization. 
			Feel free to modify colors, fonts, layouts, and features to match your style!
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
	}

	time {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}
</style>
