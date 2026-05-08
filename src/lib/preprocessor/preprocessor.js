/**
 * Svelte preprocessor for:
 * - LaTeX math using tagged template literals
 * - Wiki-style links between posts
 * - Academic references/citations
 *
 * Math transforms:
 *   {x`\frac{1}{2}`}        → static SVG (build-time)
 *   {X`\int_0^1 x dx`}      → static SVG (display mode)
 *   {x`\frac{${a}}{${b}}`}  → <Math tex={...} /> (runtime)
 * 
 * Link transforms:
 *   {link`other-post`}      → <a href="/other-post" class="internal-link">other-post</a>
 *   {link`post#heading`}    → <a href="/post#heading" class="internal-link">post</a>
 *   {l`post`}               → same as above (short alias)
 *
 * Reference transforms:
 *   {r`key`}                → <Ref keys={["key"]} />
 *   {r`key1,key2`}          → <Ref keys={["key1", "key2"]} />
 */

import { parse } from 'svelte/compiler';
import { initMathJax, renderMath, shutdownMathJax } from './mathjax.js';
import { existsSync } from 'fs';
import { join, dirname } from 'path';

// Collected links for graph building (exported for external use)
export const collectedLinks = new Map(); // filename -> Set of targets

function walk(node, visitor, parent = null) {
	if (!node || typeof node !== 'object') return;
	visitor(node, parent);
	
	if (Array.isArray(node)) {
		node.forEach(child => walk(child, visitor, parent));
		return;
	}
	
	if (node.nodes) walk(node.nodes, visitor, node);
	if (node.fragment) walk(node.fragment, visitor, node);
	if (node.consequent) walk(node.consequent, visitor, node);
	if (node.alternate) walk(node.alternate, visitor, node);
	if (node.body) walk(node.body, visitor, node);
	if (node.pending) walk(node.pending, visitor, node);
	if (node.then) walk(node.then, visitor, node);
	if (node.catch) walk(node.catch, visitor, node);
	if (node.expression && typeof node.expression === 'object') {
		walk(node.expression, visitor, node);
	}
}

function createTagMatcher(tags) {
	return (node) => {
		if (node.type === 'TaggedTemplateExpression' && node.tag?.type === 'Identifier') {
			const name = node.tag.name;
			for (const [tagName, tagType] of Object.entries(tags)) {
				if (name === tagName) return { isMatch: true, tagType };
			}
		}
		return { isMatch: false };
	};
}

function reconstructTemplateLiteral(quasis, expressions) {
	let result = '`';
	for (let i = 0; i < quasis.length; i++) {
		result += quasis[i].value.raw;
		if (i < expressions.length) {
			result += '${' + expressions[i].sourceText + '}';
		}
	}
	return result + '`';
}

function findTaggedExpressions(ast, source, tagMatcher) {
	const expressions = [];
	
	walk(ast.fragment, (node) => {
		if (node.type !== 'ExpressionTag') return;
		if (node.expression?.type !== 'TaggedTemplateExpression') return;
		
		const match = tagMatcher(node.expression);
		if (!match.isMatch) return;
		
		const tagged = node.expression;
		const quasis = tagged.quasi.quasis;
		const interpolations = tagged.quasi.expressions;
		const isStatic = interpolations.length === 0;
		
		const expr = {
			tagType: match.tagType,
			start: node.start,
			end: node.end,
			isStatic,
			rawValue: quasis.map(q => q.value.raw).join('')
		};
		
		if (!isStatic) {
			const exprsWithSource = interpolations.map(e => ({
				...e,
				sourceText: source.slice(e.start, e.end)
			}));
			expr.templateLiteral = reconstructTemplateLiteral(quasis, exprsWithSource);
		}
		
		expressions.push(expr);
	});
	
	return expressions;
}

function applyReplacements(source, replacements) {
	const sorted = [...replacements].sort((a, b) => b.start - a.start);
	let result = source;
	for (const { start, end, replacement } of sorted) {
		result = result.slice(0, start) + replacement + result.slice(end);
	}
	return result;
}

function injectImport(source, ast, importStatement) {
	if (ast.instance) {
		const scriptContent = source.slice(ast.instance.content.start, ast.instance.content.end);
		const componentName = importStatement.match(/import\s+(\w+)/)?.[1];
		if (componentName && scriptContent.includes(componentName)) return source;
		
		return (
			source.slice(0, ast.instance.content.start) +
			'\n\t' + importStatement + '\n' +
			source.slice(ast.instance.content.start)
		);
	}
	
	const insertPos = ast.module ? ast.module.end : 0;
	const scriptBlock = `<script>\n\t${importStatement}\n</script>\n\n`;
	return source.slice(0, insertPos) + scriptBlock + source.slice(insertPos);
}

function findPostsDir(filename) {
	// Walk up from file to find src/lib/posts
	let dir = dirname(filename);
	for (let i = 0; i < 10; i++) {
		const postsDir = join(dir, 'src', 'lib', 'posts');
		if (existsSync(postsDir)) return postsDir;
		const parent = dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return null;
}

function validateLink(target, postsDir, filename) {
	if (!postsDir) return { valid: true, warning: null, protected: false }; // Can't validate without posts dir
	
	const slug = target.split('#')[0];
	const postPath = join(postsDir, `${slug}.svelte`);
	
	if (!existsSync(postPath)) {
		return {
			valid: false,
			warning: `Link target "${slug}" not found (expected ${postPath})`,
			protected: false
		};
	}

	// Check if post is protected by reading metadata
	try {
		const fs = require('fs');
		const content = fs.readFileSync(postPath, 'utf-8');
		const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{([^}]+)\}/s);
		const isProtected = metadataMatch && /protected\s*:\s*true/.test(metadataMatch[1]);
		return { valid: true, warning: null, protected: isProtected || false };
	} catch (e) {
		return { valid: true, warning: null, protected: false };
	}
}

function processLink(target, postsDir, filename) {
	const [slug, anchor] = target.split('#');
	const href = anchor ? `/${slug}#${anchor}` : `/${slug}`;
	const displayText = slug.replace(/-/g, ' ');
	
	// Validate and check protection
	const { valid, warning, protected: isProtected } = validateLink(target, postsDir, filename);
	if (warning) {
		console.warn(`\x1b[33m[blog-preprocessor] ${filename}:\x1b[0m ${warning}`);
	}
	
	// Track for graph building
	const sourceSlug = filename.match(/([^/]+)\.svelte$/)?.[1] || filename;
	if (!collectedLinks.has(sourceSlug)) {
		collectedLinks.set(sourceSlug, new Set());
	}
	collectedLinks.get(sourceSlug).add(slug);
	
	const validClass = valid ? '' : ' broken-link';
	const protectedClass = isProtected ? ' protected-link' : '';
	const html = isProtected
		? `<span class="internal-link redacted-link" title="This post is protected">redacted</span>`
		: `<a href="${href}" class="internal-link${validClass}">${displayText}</a>`;
	
	return { slug: slug, html };
}

/**
 * Process a reference tag like {r`key`} or {r`key1,key2`}
 */
function processRef(rawValue) {
	const keys = rawValue.split(',').map(k => k.trim()).filter(k => k.length > 0);

	if (keys.length === 0) {
		console.warn(`[blog-preprocessor] Empty reference tag`);
		return '<span class="ref-error">[?]</span>';
	}

	const keysJson = JSON.stringify(keys);
	return `<Ref keys={${keysJson}} />`;
}

export function blogPreprocessor(options = {}) {
	const {
		mathComponentPath = '$lib/components/Math.svelte',
		refComponentPath = '$lib/components/Ref.svelte',
		inlineTag = 'x',
		displayTag = 'X',
		linkTag = 'link',
		linkTagShort = 'l',
		refTag = 'r',
		mathJaxUrl = null,
		include = /\.svelte$/
	} = options;

	let mathJaxReady = false;

	const tags = {
		[inlineTag]: 'inlineMath',
		[displayTag]: 'displayMath',
		[linkTag]: 'link',
		[linkTagShort]: 'link',
		[refTag]: 'ref'
	};

	const tagMatcher = createTagMatcher(tags);
	const quickCheckPattern = new RegExp(
		`\\{${inlineTag}\`|\\{${displayTag}\`|\\{${linkTag}\`|\\{${linkTagShort}\`|\\{${refTag}\``
	);
	
	return {
		name: 'blog-preprocessor',
		
		async markup({ content, filename }) {
			if (!include.test(filename)) return { code: content };
			if (!quickCheckPattern.test(content)) return { code: content };
			
			let ast;
			try {
				ast = parse(content, { modern: true });
			} catch (e) {
				console.error(`Failed to parse ${filename}:`, e.message);
				return { code: content };
			}
			
			const exprs = findTaggedExpressions(ast, content, tagMatcher);
			if (exprs.length === 0) return { code: content };
			
			// Find posts directory for link validation
			const postsDir = findPostsDir(filename);
			
			const replacements = [];
			let needsRuntimeMath = false;
			let needsRefComponent = false;

			const linkSlugs = [];

			for (const expr of exprs) {
				if (expr.tagType === 'link') {
					if (!expr.isStatic) {
						console.warn(`[blog-preprocessor] ${filename}: Dynamic links not supported`);
						continue;
					}
					const { slug, html } = processLink(expr.rawValue, postsDir, filename);
					replacements.push({ start: expr.start, end: expr.end, replacement: html });
					if (!linkSlugs.includes(slug)) { linkSlugs.push(slug); }
				} else if (expr.tagType === 'ref') {
					if (!expr.isStatic) {
						console.warn(`[blog-preprocessor] ${filename}: Dynamic references not supported`);
						continue;
					}
					const refHtml = processRef(expr.rawValue);
					replacements.push({ start: expr.start, end: expr.end, replacement: refHtml });
					needsRefComponent = true;
				} else {
					// Math processing
					const isDisplay = expr.tagType === 'displayMath';
					
					if (expr.isStatic) {
						if (!mathJaxReady) {
							await initMathJax();
							mathJaxReady = true;
						}
						try {
							const html = await renderMath(expr.rawValue, isDisplay);
							replacements.push({ start: expr.start, end: expr.end, replacement: html });
						} catch (e) {
							console.error(`MathJax error in ${filename}:`, e.message);
						}
					} else {
						needsRuntimeMath = true;
						const displayProp = isDisplay ? ' display' : '';
						const urlProp = mathJaxUrl ? ` mathJaxUrl="${mathJaxUrl}"` : '';
						replacements.push({
							start: expr.start,
							end: expr.end,
							replacement: `<Math${displayProp}${urlProp} tex={${expr.templateLiteral}} />`
						});
					}
				}
			}
			
			let result = applyReplacements(content, replacements);

			if (needsRuntimeMath || needsRefComponent) {
				const newAst = parse(result, { modern: true });

				if (needsRuntimeMath) {
					result = injectImport(result, newAst, `import Math from '${mathComponentPath}';`);
				}

				if (needsRefComponent) {
					// Re-parse after potential Math import injection
					const updatedAst = parse(result, { modern: true });
					result = injectImport(result, updatedAst, `import Ref from '${refComponentPath}';`);
				}
			}

			
			// Find the metadata object's closing brace
			const metadataMatch = result.match(/export\s+const\s+metadata\s*=\s*\{[^}]+/);
			if (metadataMatch) {
				const insertPos = metadataMatch.index + metadataMatch[0].length;
				const linksArray = JSON.stringify(linkSlugs);
				result = result.slice(0, insertPos) + `,\n\t\tlinks: ${linksArray}` + result.slice(insertPos);
			}
						
			return { code: result };
		}
	};
}

export { shutdownMathJax };