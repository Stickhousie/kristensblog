# Cheatsheet

Quick reference for writing posts. Copy, paste, adapt.

---

## Post Template

Every post is a `.svelte` file in `src/lib/posts/`. The slug (URL path) is the filename without `.svelte`.

```svelte
<script lang="ts" module>
	export const metadata = {
		title: 'My Post Title',
		date: '2026-01-20',
		description: 'A short description shown in post listings.',
		tags: ['topic', 'another-topic'],
		protected: false   // set true to require login
	};
</script>

<script lang="ts">
	import { inlineMath as x, displayMath as X, link as l, ref as r } from '$lib/tags';
	import Callout from '$lib/components/Callout.svelte';
	import Code from '$lib/components/Code.svelte';
	import Sidenote from '$lib/components/Sidenote.svelte';
	import LocalGraph from '$lib/components/LocalGraph.svelte';
	import Bibliography from '$lib/components/Bibliography.svelte';

	let { isAuthenticated = false } = $props();
</script>

<h1>{metadata.title}</h1>

<LocalGraph slug="my-post" {isAuthenticated} />

<!-- your content here -->

<Bibliography src="/references/my-post.json" />
```

Remove any import you don't need. `isAuthenticated` and `LocalGraph` can be omitted for simple posts.

---

## Typography

```html
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
<h4>Sub-subsection</h4>

<p>Regular paragraph text.</p>

<strong>Bold</strong>
<em>Italic</em>
<code>inline code</code>
<mark>highlighted</mark>
<s>strikethrough</s>
<sup>superscript</sup>
<sub>subscript</sub>

<blockquote>
  <p>A quoted passage.</p>
</blockquote>

<hr />   <!-- horizontal rule -->
```

---

## Lists

```html
<ul>
  <li>Unordered item</li>
  <li>Another item
    <ul>
      <li>Nested item</li>
    </ul>
  </li>
</ul>

<ol>
  <li>First</li>
  <li>Second</li>
</ol>

<dl>
  <dt>Term</dt>
  <dd>Definition</dd>
</dl>
```

---

## Links

```svelte
<!-- External link -->
<a href="https://example.com">Link text</a>

<!-- Internal link to another post (build-time validated) -->
{l`other-post-slug`}

<!-- Internal link to a section heading -->
{l`other-post-slug#section-title`}
```

Internal links are auto-formatted as the slug with hyphens replaced by spaces. To customise the display text, use a regular anchor tag.

---

## Math

```svelte
<script lang="ts">
	import { inlineMath as x, displayMath as X } from '$lib/tags';
</script>

<!-- Inline math (renders in the flow of text) -->
<p>The formula {x`f(x) = x^2`} is a parabola.</p>

<!-- Display math (centred block) -->
{X`\int_0^1 x^2 \, dx = \frac{1}{3}`}

<!-- Dynamic math with variables (runtime, uses MathJax) -->
<script lang="ts">
	import Math from '$lib/components/Math.svelte';
	let slope = 2;
</script>
<Math tex={`y = ${slope}x + 1`} />
<Math display tex={`y = ${slope}x + 1`} />
```

Use static tags (`x`, `X`) for fixed equations — they render to SVG at build time with zero runtime cost. Use `<Math>` only when the expression contains a JavaScript variable.

---

## Code Blocks

```svelte
<Code lang="typescript" code={`function greet(name: string) {
	return \`Hello, \${name}!\`;
}`} />

<!-- With a filename label -->
<Code lang="python" filename="utils.py" code={`def greet(name):
	return f"Hello, {name}!"`} />
```

Supported languages: anything Shiki supports — `typescript`, `javascript`, `python`, `rust`, `go`, `bash`, `json`, `html`, `css`, `svelte`, `sql`, `latex`, and hundreds more.

---

## Callouts

```svelte
<Callout type="info" title="Note">
	<p>Helpful information.</p>
</Callout>

<Callout type="warning" title="Watch out">
	<p>Something to be careful about.</p>
</Callout>

<Callout type="danger" title="Do not do this">
	<p>This will break things.</p>
</Callout>

<Callout type="success" title="Done">
	<p>It worked.</p>
</Callout>

<Callout type="tip" title="Pro tip">
	<p>A useful shortcut.</p>
</Callout>
```

`title` is optional. Any HTML can go inside the callout.

---

## Sidenotes

Sidenotes appear in the margin on wide screens, and collapse to an inline toggle on mobile.

```svelte
<p>
	The main text continues here<Sidenote>This appears in the margin.</Sidenote>
	and flows naturally.
</p>

<!-- Sidenote with rich content -->
<p>
	More details<Sidenote>
		<strong>Bold</strong> and {x`\LaTeX`} work inside sidenotes too.
	</Sidenote>.
</p>
```

---

## Citations and Bibliography

```svelte
<script lang="ts">
	import { ref as r } from '$lib/tags';
	import Bibliography from '$lib/components/Bibliography.svelte';
</script>

<!-- Single citation -->
<p>As shown by Shannon {r`shannon1948`}, information can be quantified.</p>

<!-- Multi-citation -->
<p>Several works {r`turing1950,shannon1948`} laid the foundations.</p>

<!-- Bibliography at the end of the post — only renders if citations exist -->
<Bibliography src="/references/my-post.json" />
```

**Reference JSON** — create at `static/references/my-post.json`:

```json
{
  "shannon1948": {
    "authors": ["Claude E. Shannon"],
    "title": "A Mathematical Theory of Communication",
    "year": 1948,
    "journal": "Bell System Technical Journal",
    "volume": "27",
    "pages": "379–423",
    "doi": "10.1002/j.1538-7305.1948.tb01338.x"
  },
  "turing1950": {
    "authors": ["Alan M. Turing"],
    "title": "Computing Machinery and Intelligence",
    "year": 1950,
    "journal": "Mind",
    "volume": "59",
    "issue": "236",
    "pages": "433–460",
    "doi": "10.1093/mind/LIX.236.433"
  },
  "goodfellow2016": {
    "authors": ["Ian Goodfellow", "Yoshua Bengio", "Aaron Courville"],
    "title": "Deep Learning",
    "year": 2016,
    "publisher": "MIT Press",
    "url": "https://www.deeplearningbook.org"
  },
  "vaswani2017": {
    "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
    "title": "Attention Is All You Need",
    "year": 2017,
    "booktitle": "Advances in Neural Information Processing Systems",
    "arxiv": "1706.03762"
  }
}
```

All fields except `title` are optional. For the full field list see `README.md`.

---

## Knowledge Graph and Local Graph

The knowledge graph at `/graph` is built automatically from `{l`...`}` internal links. Add a local graph to any post to show its connections:

```svelte
<script lang="ts">
	import LocalGraph from '$lib/components/LocalGraph.svelte';
	let { isAuthenticated = false } = $props();
</script>

<!-- slug must match the post's filename (without .svelte) -->
<LocalGraph slug="my-post-slug" {isAuthenticated} />
```

Pass `isAuthenticated` so the graph hides protected posts from unauthenticated visitors.

---

## Images

Place images in `static/images/`. Standard HTML — no special component needed.

```html
<img src="/images/my-diagram.png" alt="Diagram showing X" />

<!-- Centred with caption -->
<figure>
  <img src="/images/my-diagram.png" alt="Diagram showing X" />
  <figcaption>Figure 1: A diagram showing X.</figcaption>
</figure>
```

---

## Protected Posts

```svelte
<script lang="ts" module>
	export const metadata = {
		title: 'Private Notes',
		date: '2026-01-20',
		protected: true   // ← requires login to view
	};
</script>
```

Protected posts are hidden from the homepage, tag listings, and knowledge graph for unauthenticated visitors. Set the password in `.env`:

```
SITE_PASSWORD=your-secure-password
```

---

## Tags

```svelte
<script lang="ts" module>
	export const metadata = {
		tags: ['mathematics', 'tutorial', 'machine-learning']
	};
</script>
```

Tags appear on the post footer, the homepage, and the `/tags` page. Keep them lowercase, hyphen-separated.

---

## Publishing Workflow (VS Code)

1. Edit or create a file in `src/lib/posts/`
2. Open **Source Control** (`Ctrl+Shift+G`)
3. Stage your changes with **+**
4. Write a commit message and press **Ctrl+Enter**
5. Click **Sync Changes**

Vercel detects the push and rebuilds automatically — your post is live in ~1 minute.
