<script lang="ts" module>
	export const metadata = {
		title: 'Private Posts and Authentication',
		date: '2026-01-10',
		description: 'Creating password-protected posts for personal content.',
		tags: ['features', 'security'],
		protected: true
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
	<LocalGraph slug="example-private-post" {isAuthenticated} />
	<p style="color: var(--color-warning); font-weight: 500;">
		✓ You are viewing a protected post. Only authenticated users can see this.
	</p>

	<h2>What Are Protected Posts?</h2>

	<p>
		This blog supports password-protected posts for personal content, journaling, or anything
		you want to keep private from the public. Set <code>protected: true</code> in your post metadata
		to enable protection.
	</p>

	<h2>How It Works</h2>

	<p>
		Protected posts:
	</p>

	<ul>
		<li>Don't appear in the homepage feed for unauthenticated users</li>
		<li>Are excluded from the public knowledge graph</li>
		<li>Don't show up in tag listings for public visitors</li>
		<li>Require users to log in before viewing</li>
	</ul>

	<h2>Authentication</h2>

	<p>
		The authentication system uses simple session cookies. When you log in, a session token is stored
		in an HTTP-only cookie. This approach provides basic security suitable for personal blogs while
		keeping the implementation simple.
	</p>

	<Callout type="warning" title="Security Note">
		<p>
			This authentication is appropriate for keeping casual visitors and search engines from indexing
			private content. However, don't treat this as cryptographically secure for highly sensitive data.
			For such data, consider additional encryption or alternative hosting solutions.
		</p>
	</Callout>

	<h2>Login and Session Management</h2>

	<p>
		Users can log in via the <strong>Login</strong> link in the top navigation. A session lasts for
		the browser session—closing the browser ends the session and requires re-login.
	</p>

	<h2>Use Cases</h2>

	<ul>
		<li><strong>Personal journaling</strong> with a public blog component</li>
		<li><strong>Draft posts</strong> shared with select friends for feedback</li>
		<li><strong>Technical documentation</strong> for specific clients or teams</li>
		<li><strong>Experiments and ideas</strong> you want to develop privately before publishing</li>
		<li><strong>Sensitive information</strong> like personal thoughts or work-in-progress content</li>
	</ul>

	<h2>Setting Up Authentication</h2>

	<Callout type="warning" title="Setup Required">
		<p>
			You must create a <code>.env</code> file in your project root with your chosen password.
			This file is not included in the template. Create it yourself and set your password, then log in on the login page to view protected posts.
		</p>
	</Callout>

	<p>
		The password is configured via the <code>.env</code> file in your project root:
	</p>

	<pre><code>SITE_PASSWORD=your-secret-password</code></pre>

	<p>
		Change this to something secure. Users will enter this password on the login page.
	</p>

	<Callout type="info" title="Tip">
		<p>
			Protected posts can still link to public posts, and public posts can link to protected posts.
			Public readers will see the link but get a 404 when clicking it.
		</p>
	</Callout>

	<h2>Viewing Your Protected Content</h2>

	<p>
		You can browse other example posts and notice that this post appears in the graph and feed
		only after you've logged in. Try logging out from the navigation menu to see how the site
		changes for unauthenticated users.
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

	pre {
		background: var(--color-bg-secondary);
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 1rem 0;
		font-family: var(--font-mono);
		font-size: 0.9em;
	}

	code {
		background: var(--color-bg-secondary);
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-size: 0.9em;
		font-family: var(--font-mono);
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
