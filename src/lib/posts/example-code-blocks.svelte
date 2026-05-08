<script lang="ts" module>
	export const metadata = {
		title: 'Code Blocks and Syntax Highlighting',
		date: '2026-01-14',
		description: 'Learn how to use the Code component for beautiful syntax-highlighted code.',
		tags: ['features', 'code']
	};
</script>

<script lang="ts">
	import { inlineMath as x, link as l } from '$lib/tags';
	import Code from '$lib/components/Code.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import LocalGraph from '$lib/components/LocalGraph.svelte';

	let { isAuthenticated = false } = $props();
</script>

<h1>{metadata.title}</h1>
<p><time datetime={metadata.date}>{metadata.date}</time></p>

<article>
	<LocalGraph slug="example-code-blocks" {isAuthenticated} />
	<h2>Basic Code Block</h2>
	
	<p>Use the Code component to display syntax-highlighted code with a copy button:</p>

	<Code 
		lang="typescript"
		code={`function fibonacci(n: number): number {
	if (n <= 1) return n;
	return fibonacci(n - 1) + fibonacci(n - 2);
}`}
	/>

	<h2>With Filename</h2>
	
	<p>Add a filename to help readers understand the file context:</p>

	<Code
		filename="lib/utils.ts"
		lang="typescript"
		code={`export function calculateTotal(items: number[]): number {
	return items.reduce((sum, item) => sum + item, 0);
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(amount);
}`}
	/>

	<h2>Multiple Languages</h2>
	
	<p>The syntax highlighter supports many languages. Here are a few examples:</p>

	<h3>Python</h3>
	<Code
		lang="python"
		code={`def quicksort(arr):
	if len(arr) <= 1:
		return arr
	pivot = arr[0]
	left = [x for x in arr[1:] if x < pivot]
	right = [x for x in arr[1:] if x >= pivot]
	return quicksort(left) + [pivot] + quicksort(right)`}
	/>

	<h3>JavaScript/JSX</h3>
	<Code
		lang="jsx"
		code={`export function Counter() {
	const [count, setCount] = useState(0);
	
	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>
				Increment
			</button>
		</div>
	);
}`}
	/>

	<h3>HTML</h3>
	<Code
		lang="html"
		code={`<!DOCTYPE html>
<html>
	<head>
		<title>My Page</title>
	</head>
	<body>
		<h1>Hello, World!</h1>
		<p>This is a paragraph.</p>
	</body>
</html>`}
	/>

	<h2>Plain Text</h2>
	
	<p>You can also display plain text or CLI output:</p>

	<Code
		lang="text"
		filename="terminal output"
		code={`$ npm run build
Compiled successfully in 2.3s
dist/index.html     12 KB
dist/bundle.js      245 KB
dist/bundle.css     45 KB

✓ Ready to deploy`}
	/>

	<Callout type="tip" title="Language Support">
		<p>
			This template uses Shiki for syntax highlighting, which supports 
			<strong>hundreds of languages</strong>. Check the Shiki documentation 
			for a complete list of supported language identifiers.
		</p>
	</Callout>

	<h2>Copying Code</h2>
	
	<p>
		Every code block has a copy button in the top-right corner (or floating in the corner 
		for blocks without a filename). Click it to copy the code to your clipboard.
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

	h3 {
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-size: 1.1rem;
	}

	time {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}
</style>
