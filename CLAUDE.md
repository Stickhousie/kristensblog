# Digital Garden Template

SvelteKit 5 personal blog with a build-time preprocessor for math, internal links, and citations.

## Key references

- Post format: any file in `src/lib/posts/` — see existing example posts
- Components: `src/lib/components/`
- Colours and fonts: `src/routes/theme.css`
- Article typography: `src/lib/article.css`
- Preprocessor: `src/lib/preprocessor/preprocessor.js`

## Conventions — follow strictly

- **Svelte 5 runes only**: `$state`, `$derived`, `$effect`, `$props`. Never `export let`, `$:`, or `svelte/store`
- **`{@render children()}`** for snippets, never `<slot />`
- **TypeScript** in all `<script>` blocks
- **Vanilla CSS** with scoped `<style>` blocks — no Tailwind, no CSS framework
- **No raw MathJax/KaTeX API calls** — use the `x`/`X` tags or `<Math>` component

## The preprocessor

A build-time preprocessor transforms tagged template literals in `.svelte` files. Tags are imported from `$lib/tags` and only work with static strings.

| Tag | Alias | Output |
|-----|-------|--------|
| `` {inlineMath`...`} `` | `x` | Inline LaTeX → SVG (build time) |
| `` {displayMath`...`} `` | `X` | Block LaTeX → SVG (build time) |
| `` {link`slug`} `` | `l` | Validated internal link |
| `` {link`slug#anchor`} `` | `l` | Link with section anchor |
| `` {ref`key`} `` | `r` | Citation number → `<Ref>` component |
| `` {ref`k1,k2`} `` | `r` | Multi-citation |

For LaTeX with JavaScript variables, use `<Math tex={...} />` (runtime).

The preprocessor auto-injects `import Math` and `import Ref` when needed — do not add these manually in posts.

## Post structure

```svelte
<script lang="ts" module>
  export const metadata = {
    title: string,
    date: 'YYYY-MM-DD',
    description?: string,
    tags?: string[],
    protected?: boolean
  };
</script>

<script lang="ts">
  let { isAuthenticated = false } = $props();
</script>
```

## Authentication

- Password from `SITE_PASSWORD` env var
- `hooks.server.ts` sets `locals.isAuthenticated` via session cookie
- Pass `isAuthenticated` to `LocalGraph` and any component that needs it

## Do not introduce

- Tailwind or any CSS framework
- Legacy Svelte patterns (`export let`, `$:`, stores)
- Raw KaTeX/MathJax API calls
- Dynamic expressions inside `x`/`X`/`l`/`r` preprocessor tags
