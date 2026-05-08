<script lang="ts" module>
	export const metadata = {
		title: 'Mathematical Expressions and LaTeX',
		date: '2026-01-13',
		description: 'Rendering beautiful mathematical equations using the preprocessor and MathJax.',
		tags: ['features', 'math']
	};
</script>

<script lang="ts">
	import { inlineMath as x, displayMath as X, link as l } from '$lib/tags';
	import Callout from '$lib/components/Callout.svelte';
</script>

<h1>{metadata.title}</h1>
<p><time datetime={metadata.date}>{metadata.date}</time></p>

<article>
	<h2>Inline Math (Preprocessor)</h2>
	
	<p>
		Use template tags for inline equations that are static. For example, the quadratic formula is 
		{x`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`}
		which gives us the roots of a quadratic equation. The real numbers are: {x`\mathbb{R}`}
	</p>

	<p>
		Einstein's famous equation {x`E = mc^2`}
		relates energy and mass through the speed of light.
	</p>

	<h2>Display Math (Preprocessor)</h2>
	
	<p>Use template tags with the <code>X</code> tag for centered block equations:</p>

	{X`\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}`}

	<p>
		This is a fundamental integral in calculus and probability theory.
	</p>

	<h2>Complex Expressions</h2>

	<p>The preprocessor can render complex mathematical notation:</p>

	{X`\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u`}

	<p>
		This is the wave equation, essential in physics and engineering.
	</p>

	<h2>Series and Summations</h2>

	<p>
		Infinite series like {x`\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}`}
		appear frequently in analysis.
	</p>

	<p>More complex expressions:</p>

	{X`\sum_{n=0}^{\infty} \frac{x^n}{n!} = e^x`}

	<h2>Matrices and Vectors</h2>

	<p>
		You can also render matrices:
	</p>

	{X`\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}`}

	<h2>Limits and Derivatives</h2>

	<p>
		Calculus notation works well too:
	</p>

	{X`\lim_{x \to 0} \frac{\sin x}{x} = 1`}

	{X`\frac{d}{dx}(x^n) = nx^{n-1}`}

	<Callout type="info" title="Build-Time Rendering">
		<p>
			This blog pre-renders all static LaTeX at build time to SVG. This means equations are 
			incredibly fast since there's no runtime MathJax loading. Write your equations using standard LaTeX syntax.
		</p>
	</Callout>

	<h2>Dynamic Math (Rare Cases)</h2>

	<p>
		For very rare cases where you need dynamic math with runtime variables, you would need to handle that 
		separately since the preprocessor tags only work for static content. The template prioritizes performance 
		through build-time rendering for 99% of use cases.
	</p>

	<Callout type="info" title="When to Use What">
		<p>
			<strong>Use template tags</strong> ({x`x^2`} for inline, {X`y = x^2`} for display) for all static equations. 
			They're pre-rendered at build time to SVG and blazingly fast. This is the recommended approach.
		</p>
	</Callout>

	<h2>LaTeX Syntax Tips</h2>

	<ul>
		<li>Use standard LaTeX commands: <code>\frac</code>, <code>\sqrt</code>, <code>\sum</code>, <code>\int</code></li>
		<li>Superscripts: <code>x^2</code></li>
		<li>Subscripts: <code>x_i</code></li>
		<li>Fractions: <code>{`\\frac{`}numerator{`}{`}denominator{`}`}</code></li>
		<li>Greek letters: <code>\alpha, \beta, \gamma, \omega</code></li>
		<li>For complex expressions, test at <a href="https://www.wolframalpha.com/">Wolfram Alpha</a> or <a href="https://www.overleaf.com/">Overleaf</a></li>
	</ul>
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

	code {
		background: var(--color-bg-secondary);
		padding: 0.2em 0.4em;
		border-radius: 3px;
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
