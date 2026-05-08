import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ['github-dark', 'github-light'],
			langs: [
				'javascript', 'typescript', 'python', 'rust', 'go',
				'bash', 'shell', 'json', 'yaml', 'toml',
				'html', 'css', 'svelte', 'markdown',
				'sql', 'c', 'cpp'
			]
		});
	}
	return highlighter;
}

export async function highlight(code: string, lang: string): Promise<string> {
	const hl = await getHighlighter();
	code = code.trim();
	
	try {
		return hl.codeToHtml(code, {
			lang,
			themes: { light: 'github-light', dark: 'github-dark' },
			defaultColor: false
		});
	} catch {
		return hl.codeToHtml(code, {
			lang: 'text',
			themes: { light: 'github-light', dark: 'github-dark' },
			defaultColor: false
		});
	}
}