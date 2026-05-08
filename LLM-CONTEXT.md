# LLM Context — Digital Garden Template

Copy and paste the contents of this file at the start of a conversation with any AI assistant (Claude, ChatGPT, Gemini, etc.) to help it understand your project and give you accurate, specific help.

---

I am working on a personal blog/digital garden built from a SvelteKit template. Please use the following context to help me troubleshoot issues or make changes. Do not give me generic SvelteKit advice that ignores these specifics — they matter.

## Stack

- **SvelteKit 5** with **Svelte 5** (runes syntax: `$state`, `$derived`, `$effect`, `$props`)
- **TypeScript** in all script blocks
- **Vanilla CSS** with scoped `<style>` blocks — no Tailwind, no CSS framework
- **Vercel** for deployment (adapter-vercel, Node.js 22)
- **Shiki** for syntax highlighting (server-side, at build time)
- **MathJax** for LaTeX rendering

## How posts work

Posts are Svelte components in `src/lib/posts/`. The filename (without `.svelte`) is the URL slug. Each post exports a `metadata` object from a module script block:

```svelte
<script lang="ts" module>
  export const metadata = {
    title: 'Post Title',
    date: '2026-01-20',
    description: 'Optional description',
    tags: ['tag1', 'tag2'],
    protected: false   // true = requires login to view
  };
</script>

<script lang="ts">
  let { isAuthenticated = false } = $props();
</script>
```

All posts receive `isAuthenticated` as a prop from the layout. Protected posts are hidden from unauthenticated users.

## The build-time preprocessor

This is the most important and non-obvious part of the project. There is a custom Svelte preprocessor (`src/lib/preprocessor/preprocessor.js`) that runs at build time and transforms special tagged template literals before Svelte sees the file.

**The three tags (imported from `$lib/tags`):**

| Tag | Import alias | What it does |
|-----|-------------|--------------|
| `` {x`\LaTeX`} `` | `inlineMath as x` | Renders inline LaTeX to SVG at build time |
| `` {X`\LaTeX`} `` | `displayMath as X` | Renders display/block LaTeX to SVG at build time |
| `` {l`slug`} `` | `link as l` | Creates a validated internal link; validates the target post exists |
| `` {l`slug#anchor`} `` | `link as l` | Link to a specific heading in another post |
| `` {r`key`} `` | `ref as r` | Inserts a citation number linking to the bibliography |
| `` {r`key1,key2`} `` | `ref as r` | Groups multiple citations |

**Critical rules:**
- These tags only work with **static strings** — no JavaScript expressions inside them
- They must use backtick template literal syntax: `` {x`...`} `` not `x('...')`
- They must be imported: `import { inlineMath as x, displayMath as X, link as l, ref as r } from '$lib/tags'`
- For math with variables, use `<Math tex={...} />` instead (runtime rendering via MathJax)
- The `l` tag validates link targets at build time — a broken link causes a build error

**What the preprocessor does automatically:**
- Injects `import Math from '$lib/components/Math.svelte'` when it finds dynamic math
- Injects `import Ref from '$lib/components/Ref.svelte'` when it finds citation tags
- Adds a `links` array to the post's metadata (used to build the knowledge graph)

## Components

All components are in `src/lib/components/`. Usage:

```svelte
import Callout from '$lib/components/Callout.svelte';
import Code from '$lib/components/Code.svelte';
import Sidenote from '$lib/components/Sidenote.svelte';
import LocalGraph from '$lib/components/LocalGraph.svelte';
import Math from '$lib/components/Math.svelte';
import Bibliography from '$lib/components/Bibliography.svelte';
import Ref from '$lib/components/Ref.svelte';   // usually auto-injected by preprocessor
import ABC from '$lib/components/ABC.svelte';
```

**Callout** — `type` is one of: `info`, `warning`, `danger`, `success`, `tip`, `question`, `quote`
```svelte
<Callout type="info" title="Optional title"><p>Content</p></Callout>
```

**Code** — syntax highlighted, server-side via Shiki
```svelte
<Code lang="python" filename="optional.py" code={`print("hello")`} />
```

**Sidenote** — margin note on desktop, toggle on mobile
```svelte
<p>Text<Sidenote>Margin content</Sidenote> continues.</p>
```

**LocalGraph** — shows connections for this post in the knowledge graph
```svelte
<LocalGraph slug="this-post-slug" {isAuthenticated} />
```

**Math** — runtime LaTeX for dynamic expressions
```svelte
<Math tex={`f(x) = ${someVar}`} />
<Math display tex={`E = mc^2`} />
```

**Bibliography and Ref** — academic citations
```svelte
// In post: {r`key`} or {r`key1,key2`}
// At end of post:
<Bibliography src="/references/my-post.json" />
```

**ABC** — sheet music from ABC notation files
```svelte
<ABC path="/mycomposition.abc" />
```

## Citation system

- `Ref.svelte` renders inline citation numbers `[1]`, `[2,3]`
- `Bibliography.svelte` fetches a JSON file from `static/references/` and renders the reference list
- `refStore.ts` tracks citation order; `resetRefs()` is called in `src/routes/[slug]/+page.svelte` before each article renders
- Reference JSON keys match the string used in `` {r`key`} ``

## Authentication

- Password set via `SITE_PASSWORD` environment variable in `.env` (local) and Vercel Environment Variables (production)
- `src/hooks.server.ts` checks a session cookie and sets `locals.isAuthenticated`
- Protected posts (`protected: true` in metadata) redirect unauthenticated users to `/login`
- Session is cookie-based and closes when the browser is closed

## Knowledge graph

- Built automatically from `{l`...`}` internal links during the build
- Available at `/graph`
- `LocalGraph` component shows connections for a specific post
- Protected posts are hidden from the graph for unauthenticated users

## File structure

```
src/
  lib/
    components/       — all reusable components
    posts/            — blog posts (one .svelte file per post)
    assets/fonts/     — local font files (.woff2)
    preprocessor/     — build-time preprocessor (do not edit unless you know what you're doing)
    article.css       — article typography
    graph.ts          — knowledge graph logic
    posts.ts          — post discovery and filtering
    refStore.ts       — citation order tracking
    shiki.ts          — syntax highlighter config
    tags.ts           — tag stubs for editor intellisense
  routes/
    +layout.svelte    — site header, navigation
    +page.svelte      — homepage
    theme.css         — colour palette and font variables
    [slug]/           — individual post pages
    graph/            — knowledge graph page
    tags/             — tag browsing
    login/            — login page
    api/logout/       — logout endpoint
  hooks.server.ts     — authentication middleware
static/
  references/         — citation JSON files
  *.abc               — sheet music files
```

## Common mistakes to avoid

- Do not use `export let` or `$:` — this is Svelte 5, use `$props()`, `$state()`, `$derived()`
- Do not use `<slot />` — use `{@render children()}` for snippets
- Do not use `writable`/`readable` from `svelte/store` — use runes
- Do not use raw KaTeX or MathJax API — use the `x`/`X` tags or `<Math>` component
- Do not put dynamic expressions inside `x`/`X`/`l`/`r` tags — use `<Math>` for dynamic math
- The `r` tag is transformed by the preprocessor — do not manually import or use `<Ref>` directly in posts
