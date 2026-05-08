# Digital Garden Template

A blog template for building your own personal website — a place to write notes, share ideas, and link them together into a knowledge graph. No coding experience required to get started.

---

## Table of Contents

1. [What You Get](#1-what-you-get)
2. [Getting Started](#2-getting-started)
3. [Writing Your First Post](#3-writing-your-first-post)
4. [Publishing (The Daily Workflow)](#4-publishing-the-daily-workflow)
5. [Features](#5-features)
   - [Math](#math)
   - [Code Blocks](#code-blocks)
   - [Callouts](#callouts)
   - [Sidenotes](#sidenotes)
   - [Internal Links and Knowledge Graph](#internal-links-and-knowledge-graph)
   - [Citations and Bibliography](#citations-and-bibliography)
   - [Sheet Music](#sheet-music)
   - [Tags](#tags)
   - [Password-Protected Posts](#password-protected-posts)
   - [Dark Mode](#dark-mode)
6. [Customisation](#6-customisation)
7. [Deploying to the Web](#7-deploying-to-the-web)
8. [Troubleshooting](#8-troubleshooting)
9. [Project Structure](#9-project-structure)
10. [Credits](#10-credits)

---

## 1. What You Get

- **Posts** — write articles using a simple file format, organised by tags
- **Knowledge graph** — posts you link together form an interactive visual graph at `/graph`
- **Math rendering** — write LaTeX equations that render beautifully
- **Syntax-highlighted code** — paste code in any language with automatic colouring
- **Callouts, sidenotes, sheet music** — rich components for expressive writing
- **Academic citations** — cite sources and generate a formatted bibliography automatically
- **Password protection** — hide private posts behind a login
- **Dark mode** — automatic, with a manual toggle
- **One-click publishing** — push to GitHub and your site rebuilds itself on Vercel

> **Quick reference:** See `CHEATSHEET.md` in this repo for copy-paste snippets of everything.

---

## 2. Getting Started

You will need three free tools installed on your computer:
- [Node.js](https://nodejs.org/) (choose the LTS version)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommended editor)

You will also need a free [GitHub](https://github.com) account.

**Step 1 — Create your own copy on GitHub**

At the top of this repository's GitHub page, click the green **Use this template** button and select **Create a new repository**. Give it any name you like (e.g. `my-blog`), choose Public or Private, then click **Create repository**. GitHub creates a fresh independent copy under your own account — it is not linked to this one.

**Step 2 — Download your copy to your computer**

On your new repository's GitHub page, click the green **Code** button and copy the URL. Then open a terminal and run:

```bash
git clone <the-url-you-just-copied>
cd <your-repository-name>
```

**Step 3 — Install dependencies**

```bash
npm install
```

This downloads the libraries the project depends on. It only needs to be done once.

**Step 4 — Create your environment file**

```bash
echo "SITE_PASSWORD=choose-a-password" > .env
```

This sets the password for your protected posts. Replace `choose-a-password` with something you'll remember.

**Step 5 — Start the local preview**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. You should see the blog with the example posts. Changes you make to files are reflected instantly in the browser.

---

## 3. Writing Your First Post

Posts live in `src/lib/posts/`. The filename becomes the URL — `my-first-post.svelte` is accessible at `yoursite.com/my-first-post`.

Create a new file, for example `src/lib/posts/my-first-post.svelte`:

```svelte
<script lang="ts" module>
	export const metadata = {
		title: 'My First Post',
		date: '2026-01-20',
		description: 'A short description shown in listings.',
		tags: ['hello', 'welcome']
	};
</script>

<h1>{metadata.title}</h1>

<p>Hello, world! This is my first post.</p>

<h2>A Section</h2>

<p>Write whatever you like using normal HTML tags.</p>
```

Save the file. The dev server picks it up automatically — no restart needed.

### Metadata fields

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Shown in listings and the browser tab |
| `date` | Yes | ISO format: `YYYY-MM-DD` |
| `description` | No | Shown under the title in listings |
| `tags` | No | Array of strings for categorisation |
| `protected` | No | Set to `true` to require login |

---

## 4. Publishing (The Daily Workflow)

Once your site is live on Vercel (see [Deploying to the Web](#7-deploying-to-the-web)), publishing a new post takes about 30 seconds:

1. **Open Source Control** in VS Code — press `Ctrl+Shift+G` (or `Cmd+Shift+G` on Mac)
2. **Stage your changes** — hover over the changed files and click the **+** icon, or click **+** next to "Changes" to stage everything at once
3. **Write a message** — type a short note in the box at the top, e.g. `Add post on neural networks`
4. **Commit** — press `Ctrl+Enter`
5. **Sync** — click the **Sync Changes** button (circular arrow in the status bar)

That's it. Vercel detects the push and rebuilds your site automatically — it's usually live within 1–2 minutes.

**What does Sync do?** It runs `git pull` (downloads any remote changes) then `git push` (uploads yours) in one click. You rarely need anything else.

**Checking your deployment:** Open your Vercel dashboard after syncing. Once it shows **Ready**, your site is live. If the build fails, Vercel shows the error log — most often it's a broken internal link (the build will tell you which file and which post slug couldn't be found).

---

## 5. Features

### Math

Write LaTeX equations inline with text or as centred display blocks. Import the tags at the top of your post:

```svelte
<script lang="ts">
	import { inlineMath as x, displayMath as X } from '$lib/tags';
</script>

<p>The formula {x`f(x) = x^2`} is a parabola.</p>

{X`\int_0^1 x^2 \, dx = \frac{1}{3}`}
```

Equations are converted to images at build time, so your site loads fast with no extra JavaScript.

**Need an equation with a variable?** Use the `<Math>` component instead:

```svelte
<script lang="ts">
	import Math from '$lib/components/Math.svelte';
	let n = 5;
</script>

<Math tex={`x^{${n}}`} />
```

> Test your LaTeX at [Overleaf](https://www.overleaf.com/) or [Wolfram Alpha](https://www.wolframalpha.com/) before pasting it in.

---

### Code Blocks

```svelte
<script lang="ts">
	import Code from '$lib/components/Code.svelte';
</script>

<Code lang="python" code={`def greet(name):
	return f"Hello, {name}!"`} />

<!-- With a filename label -->
<Code lang="typescript" filename="utils.ts" code={`function greet(name: string) {
	return \`Hello, \${name}!\`;
}`} />
```

Hundreds of languages are supported. Common ones: `python`, `javascript`, `typescript`, `rust`, `go`, `bash`, `json`, `html`, `css`, `svelte`, `sql`.

---

### Callouts

Draw attention to important information:

```svelte
<script lang="ts">
	import Callout from '$lib/components/Callout.svelte';
</script>

<Callout type="info" title="Note">
	<p>Something helpful to know.</p>
</Callout>

<Callout type="warning" title="Watch out">
	<p>Be careful here.</p>
</Callout>

<Callout type="danger" title="Do not do this">
	<p>This will break things.</p>
</Callout>

<Callout type="success" title="Done">
	<p>You did it correctly.</p>
</Callout>

<Callout type="tip" title="Pro tip">
	<p>A useful shortcut.</p>
</Callout>
```

`title` is optional. Any HTML can go inside.

---

### Sidenotes

Marginal notes that appear beside the text on wide screens, and collapse to a toggle on mobile:

```svelte
<script lang="ts">
	import Sidenote from '$lib/components/Sidenote.svelte';
</script>

<p>
	The main text continues here<Sidenote>This appears in the margin.</Sidenote>
	and flows naturally.
</p>
```

---

### Internal Links and Knowledge Graph

Link between your posts using the `l` tag. The build checks that the target post actually exists:

```svelte
<script lang="ts">
	import { link as l } from '$lib/tags';
</script>

<p>See {l`other-post`} for more on this topic.</p>

<!-- Link to a specific heading within a post -->
<p>Jump to {l`other-post#section-title`} directly.</p>
```

Every internal link is automatically added to the knowledge graph at `/graph`. Add a local graph to any post to show which posts it connects to:

```svelte
<script lang="ts">
	import LocalGraph from '$lib/components/LocalGraph.svelte';
	let { isAuthenticated = false } = $props();
</script>

<LocalGraph slug="my-post-slug" {isAuthenticated} />
```

> `isAuthenticated` controls whether protected posts are shown in the graph. Every post receives this value automatically from the site — just pass it through as shown.

---

### Citations and Bibliography

For posts that cite academic sources:

```svelte
<script lang="ts">
	import { ref as r } from '$lib/tags';
	import Bibliography from '$lib/components/Bibliography.svelte';
</script>

<p>Shannon's information theory {r`shannon1948`} is foundational.</p>

<!-- Cite multiple sources at once -->
<p>Several works {r`turing1950,shannon1948`} laid the groundwork.</p>

<!-- Place at the end of the post — only renders if citations exist -->
<Bibliography src="/references/my-post.json" />
```

Citations are numbered in the order they first appear. Create a JSON file in `static/references/` with your reference data:

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
  }
}
```

Supported fields: `authors`, `title`, `year`, `journal`, `volume`, `issue`, `pages`, `booktitle` (conference papers), `publisher`, `edition` (books), `doi`, `arxiv`, `url`, `note`. All fields except `title` are optional.

See the example post `example-references` and the sample file `static/references/example.json` for a full working demonstration.

---

### Sheet Music

Render music notation from [ABC notation](https://abcnotation.com/) — a plain-text format for music:

```svelte
<script lang="ts">
	import ABC from '$lib/components/ABC.svelte';
</script>

<ABC path="/mycomposition.abc" />
```

Place `.abc` files in `static/`.

---

### Tags

Add tags to any post's metadata:

```svelte
<script lang="ts" module>
	export const metadata = {
		tags: ['mathematics', 'tutorial', 'machine-learning']
	};
</script>
```

Tags appear on the post, the homepage, and the `/tags` page. Use lowercase, hyphen-separated names.

---

### Password-Protected Posts

```svelte
<script lang="ts" module>
	export const metadata = {
		title: 'Private Notes',
		date: '2026-01-20',
		protected: true
	};
</script>
```

Protected posts are hidden from the homepage, tag listings, and knowledge graph for anyone who isn't logged in. They can log in via the **Login** link in the navigation. The session closes when the browser is closed.

Set the password in your `.env` file:

```
SITE_PASSWORD=your-secure-password
```

---

### Dark Mode

The site detects your system's dark/light preference automatically and includes a toggle in the header. No setup required.

---

## 6. Customisation

### Choosing a colour scheme

A good way to find colours you like is to pick them from a website whose look appeals to you, using an eyedropper tool.

**In any browser (Chrome, Firefox, Edge):**
1. Open the website you want to sample from
2. Open the browser's developer tools — press `F12`
3. Click the **colour picker / eyedropper icon** (in Chrome it's under the *Styles* panel when you click any colour swatch; in Firefox you can also find it via **Tools → Browser Tools → Eyedropper**)
4. Hover over any part of the page to sample its colour — it shows the hex code (e.g. `#2d3748`)
5. Note down a handful of colours: a background, a text colour, an accent/link colour

Alternatively, [coolors.co](https://coolors.co) lets you generate and browse complete palettes, and [realfavicongenerator.net](https://realfavicongenerator.net) is useful for checking contrast.

Once you have your colours, open `src/routes/theme.css`. The file uses CSS variables that look like this:

```css
:root {
    --color-bg: #ffffff;
    --color-text: #1a1a1a;
    --color-accent: #2563eb;
    /* ... */
}

:root.dark {
    --color-bg: #0f0f0f;
    --color-text: #e5e5e5;
    --color-accent: #60a5fa;
    /* ... */
}
```

Replace the hex values with your chosen colours. The `:root` block is the light mode palette and `:root.dark` is the dark mode palette. You can run `npm run dev` while editing to see changes update live in the browser.

---

### Adding a Google Font

[Google Fonts](https://fonts.google.com) offers hundreds of free fonts. The recommended approach for self-hosting (faster, no external requests) is to download the font files directly.

**Step 1 — Find and download the font**

1. Go to [fonts.google.com](https://fonts.google.com) and browse until you find a font you like
2. Click the font, then click **Get font** (top right)
3. Click **Download all** — this gives you a `.zip` file containing `.ttf` font files

**Step 2 — Convert to woff2 (optional but recommended)**

`.woff2` files are smaller and load faster than `.ttf`. You can convert them for free at [cloudconvert.com/ttf-to-woff2](https://cloudconvert.com/ttf-to-woff2) — upload your `.ttf`, download the `.woff2`.

**Step 3 — Add the font files to the project**

Create a folder for the font inside `src/lib/assets/fonts/`, for example `src/lib/assets/fonts/MyFont/`, and place the `.woff2` files there. A font typically comes in multiple weights (Regular, Bold) and styles (Italic) — add whichever you need.

**Step 4 — Declare the font in theme.css**

Add `@font-face` blocks at the top of `src/routes/theme.css`, one per file:

```css
@font-face {
    font-family: 'My Font';
    src: url('$lib/assets/fonts/MyFont/myfont-regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'My Font';
    src: url('$lib/assets/fonts/MyFont/myfont-bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}
```

**Step 5 — Update the font variable**

In `src/routes/theme.css`, find the font variables in `:root` and update them:

```css
:root {
    --font-body: 'My Font', Georgia, serif;
    --font-heading: 'My Font', sans-serif;
}
```

The fallback fonts after the comma (e.g. `Georgia, serif`) are used if your font fails to load — keep them as a sensible fallback.

---

### Navigation

Edit the links in `src/routes/+layout.svelte` to change what appears in the header:

```svelte
<nav>
	<a href="/">Blog</a>
	<a href="/tags">Tags</a>
	<a href="/graph">Graph</a>
</nav>
```

### Homepage content

Edit `src/routes/+page.svelte` to change the intro text, heading, and layout of the homepage.

---

## 7. Deploying to the Web

### Step 1 — Create a GitHub repository

Push your local code to a new GitHub repository. If you haven't done this before, VS Code's Source Control panel has a **Publish to GitHub** button that walks you through it.

### Step 2 — Create a Vercel account

Sign up for free at [vercel.com](https://vercel.com). You can log in with your GitHub account.

### Step 3 — Connect your repository

1. Click **Add New Project** in your Vercel dashboard
2. Select your GitHub repository
3. Vercel detects the SvelteKit configuration automatically — no changes needed
4. Before clicking Deploy, go to **Environment Variables** and add:
   - Name: `SITE_PASSWORD`
   - Value: your chosen password

### Step 4 — Your site is live

Vercel gives you a free URL like `your-project.vercel.app`. Every time you push to GitHub, it rebuilds automatically.

### Custom domain

1. Buy a domain from [Namecheap](https://namecheap.com), [GoDaddy](https://godaddy.com), or any registrar
2. In Vercel: **Settings → Domains → Add**
3. Follow the DNS instructions Vercel provides
4. Allow 2–24 hours for the domain to propagate

---

## 8. Troubleshooting

**My post doesn't appear on the homepage.**
- Make sure the filename ends in `.svelte` and is inside `src/lib/posts/`
- Check that `metadata` is exported correctly (look at an example post)
- Restart the dev server: stop it with `Ctrl+C` and run `npm run dev` again

**I'm getting a build error about a missing link.**
- The build validates all `{l`...`}` internal links. Check that the slug you're linking to matches a filename in `src/lib/posts/` exactly (it's case-sensitive)
- If you deleted a post, remove all links that pointed to it

**My math isn't rendering.**
- Make sure you imported the tags: `import { inlineMath as x, displayMath as X } from '$lib/tags'`
- Use backtick syntax: `{x`...`}` — not `x('...')`
- For equations with JavaScript variables, use `<Math tex={...} />` instead

**The build fails on Vercel but works locally.**
- Check the Vercel build log for the specific error
- Most often it's a broken internal link — the log will name the file and the missing slug

**I forgot my site password.**
- Update `SITE_PASSWORD` in your Vercel project's Environment Variables, then redeploy

---

## 9. Project Structure

```
src/
├── lib/
│   ├── components/        # Reusable components (Callout, Code, Sidenote, etc.)
│   ├── posts/             # Your blog posts — one file per post
│   ├── assets/fonts/      # Local font files
│   ├── article.css        # Article typography styles
│   ├── posts.ts           # Post discovery logic
│   ├── graph.ts           # Knowledge graph data
│   ├── tags.ts            # Math/link/citation tag stubs
│   └── shiki.ts           # Syntax highlighter setup
├── routes/
│   ├── +layout.svelte     # Site header and navigation
│   ├── +page.svelte       # Homepage
│   ├── theme.css          # Colours and fonts
│   ├── [slug]/            # Individual post pages
│   ├── graph/             # Knowledge graph page
│   ├── tags/              # Tags browsing page
│   ├── login/             # Login page
│   └── api/logout/        # Logout endpoint
├── hooks.server.ts        # Authentication middleware
└── app.d.ts               # TypeScript type definitions

static/
├── fonts/                 # Font files
├── references/            # Citation JSON files
└── *.abc                  # Sheet music files

CHEATSHEET.md              # Quick copy-paste reference for all features
```

You only need to touch `src/lib/posts/` for day-to-day writing. Everything else is set up for you.

---

## 10. Credits

Built with:
- [SvelteKit](https://kit.svelte.dev/) — web framework
- [Shiki](https://shiki.matsu.io/) — syntax highlighting
- [MathJax](https://www.mathjax.org/) — LaTeX rendering
- [D3.js](https://d3js.org/) — knowledge graph visualisation
- [abcjs](https://abcjs.net/) — sheet music rendering

---

*This template is open source. Use it, modify it, make it yours.*
