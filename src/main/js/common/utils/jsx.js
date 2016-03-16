/**
 * Utilitity to abstract away setting raw content on a React component. The content MUST be valid and sanitized.
 *
 * @param {String} x - A sanitized & valid HTML string.
 *
 * @return {Object} An object with one prop: dangerouslySetInnerHTML setup to contain your raw content value.
 */
export const rawContent = x => ({dangerouslySetInnerHTML: {__html: x}});

export function sanitizeContent (html) {
	let d = document.createElement('div');
	return (d.innerHTML = html, d.innerHTML);
}
