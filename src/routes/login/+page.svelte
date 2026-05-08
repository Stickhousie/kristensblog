<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<main>
	<div class="login-container">
		<h1>Protected Content</h1>
		<p class="subtitle">Enter the password to access protected posts.</p>
		
		<form method="POST" use:enhance>
			{#if data.redirect}
				<input type="hidden" name="redirect" value={data.redirect} />
			{/if}
			
			<label>
				<span class="visually-hidden">Password</span>
				<input
					type="password"
					name="password"
					placeholder="Password"
					autocomplete="current-password"
					required
				/>
			</label>
			
			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}
			
			<button type="submit">Login</button>
		</form>
		
		<a href="/" class="back">← Back to home</a>
	</div>
</main>

<style>
	main {
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1.5rem;
	}
	
	.login-container {
		width: 100%;
		max-width: 320px;
		text-align: center;
	}
	
	h1 {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		margin: 0 0 0.5rem 0;
	}
	
	.subtitle {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
		margin: 0 0 2rem 0;
	}
	
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	input {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		font-family: inherit;
		color: var(--color-text);
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border-muted);
		border-radius: 6px;
		box-sizing: border-box;
	}
	
	input:focus {
		outline: none;
		border-color: var(--color-accent);
	}
	
	input::placeholder {
		color: var(--color-text-secondary);
	}
	
	button {
		padding: 0.75rem 1rem;
		font-size: 1rem;
		font-family: inherit;
		font-weight: 500;
		color: var(--color-bg);
		background-color: var(--color-text);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: opacity 0.15s;
	}
	
	button:hover {
		opacity: 0.85;
	}
	
	.error {
		color: var(--color-error, #e53935);
		font-size: 0.875rem;
		margin: 0;
	}
	
	.back {
		display: inline-block;
		margin-top: 1.5rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		text-decoration: none;
	}
	
	.back:hover {
		color: var(--color-accent);
	}
	
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>