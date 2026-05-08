<script lang="ts" module>
	export const metadata = {
		title: 'Callouts and Sidenotes',
		date: '2026-01-12',
		description: 'Using callouts and Tufte-style sidenotes to enhance your writing.',
		tags: ['features', 'components']
	};
</script>

<script lang="ts">
	import { inlineMath as x, link as l } from '$lib/tags';
	import Callout from '$lib/components/Callout.svelte';
	import Sidenote from '$lib/components/Sidenote.svelte';
	import LocalGraph from '$lib/components/LocalGraph.svelte';

	let { isAuthenticated = false } = $props();
</script>

<h1>{metadata.title}</h1>
<p><time datetime={metadata.date}>{metadata.date}</time></p>

<article>
	<LocalGraph slug="example-components" {isAuthenticated} />
	<h2>Callouts</h2>

	<p>
		Callouts draw attention to important information. This blog supports seven types of callouts.
	</p>

	<Callout type="info" title="Info">
		<p>Use this for general informational messages and helpful context.</p>
	</Callout>

	<Callout type="warning" title="Warning">
		<p>Use this for warnings and important cautions that readers should be aware of.</p>
	</Callout>

	<Callout type="danger" title="Danger">
		<p>Use this for critical warnings about potential problems or breaking changes.</p>
	</Callout>

	<Callout type="success" title="Success">
		<p>Use this to highlight successful outcomes, achievements, or positive outcomes.</p>
	</Callout>

	<Callout type="tip" title="Tip">
		<p>Use this for helpful tips and best practices that improve the reader's experience.</p>
	</Callout>

	<Callout type="question" title="Question">
		<p>Use this to pose questions to the reader or highlight areas that need clarification.</p>
	</Callout>

	<Callout type="quote" title="Quote">
		<p>Use this to highlight quotations, citations, or notable excerpts from other sources.</p>
	</Callout>

	<h2>Callout Without a Title</h2>

	<Callout type="info">
		<p>Callouts work without a title too if you want a more subtle emphasis.</p>
	</Callout>

	<h2>Sidenotes</h2>

	<p>
		Sidenotes provide marginal comments in the style of Edward Tufte's design philosophy.
		<Sidenote>Like this one! On wide screens, this appears in the right margin. On narrow screens, it's an inline expandable element.</Sidenote>
		They're perfect for tangential information that enriches the main narrative without interrupting it.
	</p>

	<p>
		You can use multiple sidenotes throughout your post.
		<Sidenote>Each one is automatically numbered based on its position in the document.</Sidenote>
		The sidenote styling adapts to the screen size—on desktop they float in the margin, while on mobile they become expandable inline elements.
	</p>

	<h2>When to Use What</h2>

	<p>
		Choosing between callouts and sidenotes affects how your reader experiences your content. 
		Sidenotes are great for supplementary context about {x`\mathcal{O}(n \log n)`} algorithms 
		or relating to concepts in {l`example-code-blocks`}.
	</p>	

	<ul>
		<li>
			<strong>Callouts:</strong> Use when you have information that 
			<Sidenote>Examples include security warnings, breaking changes, pro tips, etc.</Sidenote>
			needs immediate attention or emphasis.
		</li>
		<li>
			<strong>Sidenotes:</strong> Use for supplementary context that enriches understanding 
			without being essential to follow the main narrative.
		</li>
	</ul>

	<h2>Combining Components</h2>

	<p>
		You can nest components intelligently. For instance, a warning in a sidenote:
	</p>

	<p>
		This approach to error handling
		<Sidenote>
			<strong>Careful:</strong> Never ignore errors silently. This can lead to hard-to-debug issues. Always log them for debugging.
		</Sidenote>
		is widely used in production systems.
	</p>

	<Callout type="tip" title="Design Tip">
		<p>
			Use callouts sparingly to preserve their impact. If you use them too frequently, 
			they lose their visual emphasis and ability to draw attention.
		</p>
	</Callout>

	<h2>Mobile Experience</h2>

	<p>
		Both callouts and sidenotes are designed to work well on mobile devices. 
		Callouts maintain their appearance,
		<Sidenote>Sidenotes become expandable elements that don't clutter the main text on narrow screens.</Sidenote>
		while sidenotes intelligently adapt to the available space.
	</p>
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
		margin-bottom: 0.75rem;
	}

	time {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}
</style>
