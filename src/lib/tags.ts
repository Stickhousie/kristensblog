/**
 * Tag stubs for editor intellisense.
 *
 * These functions exist only for the editor — they're never called at runtime.
 * The preprocessor transforms them at build time.
 *
 * Usage:
 *   import { inlineMath as x, displayMath as X, link as l, ref as r } from '$lib/tags';
 *
 *   {x`f(x) = x^2`}          inline math
 *   {X`\int_0^1 x\,dx`}      display math
 *   {l`other-post`}           internal link
 *   {r`smith2020`}            citation
 *   {r`smith2020,jones2021`}  multi-citation
 */

/** Inline math (rendered inline with text) */
export function inlineMath(strings: TemplateStringsArray, ...values: unknown[]): string {
	return '';
}

/** Display math (centered block equation) */
export function displayMath(strings: TemplateStringsArray, ...values: unknown[]): string {
	return '';
}

/** 
 * Link to another post. Supports optional heading anchor.
 * 
 * Examples:
 *   {link`other-post`}           → links to /other-post
 *   {link`other-post#section`}   → links to /other-post#section
 */
export function link(strings: TemplateStringsArray, ...values: unknown[]): string {
	return '';
}

/** Citation tag — single key or comma-separated list of keys */
export function ref(strings: TemplateStringsArray, ...values: unknown[]): string {
	return '';
}

// Short aliases
export { inlineMath as x, displayMath as X, link as l, ref as r };