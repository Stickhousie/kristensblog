import { init } from 'mathjax';

let MathJax = null;
let ready = null;

export async function initMathJax() {
	if (ready) return ready;
	
	ready = (async () => {
		MathJax = await init({
			loader: { load: ['input/tex', 'output/svg'] },
			tex: {
				packages: ['base', 'ams', 'newcommand', 'configmacros']
			},
			svg: {
				fontCache: 'local'
			},
			startup: {
				typeset: false
			}
		});
		
		// Ensure all async initialization is complete
		await MathJax.startup.promise;
	})();
	
	return ready;
}

export async function renderMath(latex, display = false) {
	await initMathJax();
	
	// Use promise-based conversion to avoid async retry errors
	const node = await MathJax.tex2svgPromise(latex, { display });
	let html = MathJax.startup.adaptor.outerHTML(node);
	
	// Strip data-latex attributes (contain backslashes that break Svelte parsing)
	html = html.replace(/ data-latex="[^"]*"/g, '');
	
	const wrapperClass = display ? 'math-display' : 'math-inline';
	return `<span class="${wrapperClass}">${html}</span>`;
}

export async function shutdownMathJax() {
	MathJax = null;
	ready = null;
}