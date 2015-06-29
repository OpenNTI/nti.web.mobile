import {replaceNode, parent} from 'nti.lib.dom';

import guid from 'nti.lib.interfaces/utils/guid';
import indexArrayByKey from 'nti.lib.interfaces/utils/array-index-by-key';
import toArray from 'nti.lib.interfaces/utils/toarray';

import DEFAULT_STRATEGIES from './dom-parsers';

const MARKER_REGEX = /nti:widget-marker\[([^\]\>]+)\]/i;
const WIDGET_MARKER_REGEX = /<!--(?:[^\]>]*)(nti:widget-marker\[(?:[^\]\>]+)\])(?:[^\]>]*)-->/ig;


/**
 * Take HTML content and parse it into parts that we can render widgets into it.
 *
 * @param {Object} packet     Should be and object with a property named 'content' that is a string.
 * @param {Object} strategies An object where the keys are the CSS selectors for widgets, and
 *                            the values are functions to transform that selected element into
 *                            an Object used to render the Widget.
 * @returns {object} A packet of data, content, body, styles and widgets.
 */
export function processContent(packet, strategies = DEFAULT_STRATEGIES) {
	let html = packet.content;
	let parser = null;
	if (typeof DOMParser !== 'undefined') {
		parser = new DOMParser();
	}

	let start = /<(!DOCTYPE|html)/i.exec(html);
	if (start && start.index > 0) {
		html = html.substr(start.index);
	}


	let doc = parser && parser.parseFromString(html, 'text/html');
	let elementFactory = doc || document;
	if (!doc) {
		doc = document.createElement('html');
		doc.innerHTML = html;
	}

	let body = doc.getElementsByTagName('body')[0];
	let styles = toArray(doc.querySelectorAll('link[rel=stylesheet]'))
					.map(i=>i.getAttribute('href'));

	let widgets = indexArrayByKey(parseWidgets(strategies, doc, elementFactory), 'guid');

	let bodyParts = body.innerHTML.split(WIDGET_MARKER_REGEX).map(part => {
		let m = part.match(MARKER_REGEX);
		if (m && m[1]) {
			return widgets[m[1]];
		}
		return part;
	});

	return Object.assign(packet, {
		content: body.innerHTML,
		body: bodyParts,
		styles: styles,
		widgets: widgets
	});
}

/**
 * @param {Object} strategies		An object where the keys are the CSS selectors for widgets, and
 *                             		the values are functions to transform that selected element into
 *                             		an Object used to render the Widget.
 *
 * @param {Document} doc			The content to search.
 *
 * @param {Node} elementFactory		A Dom object that has an implementation for 'createComment'.
 * @returns {object[]} An array of objects representing widgets.
 */
export function parseWidgets(strategies, doc, elementFactory) {

	function makeMarker(id) {
		return elementFactory.createComment('nti:widget-marker[' + id + ']');
	}

	function flatten(list, array) {
		if (!Array.isArray(array)) {
			array = [array];
		}

		list.push(...array);

		return list;
	}

	let selectors = Object.keys(strategies);

	return selectors
		.map(selector=> toArray(doc.querySelectorAll(selector))
			//do not process nested objects
			.filter(el => selectors.every(x=> !parent(el.parentNode, x)))
			.map(el => {

				let id = el.getAttribute('id');
				let result = strategies[selector](el) || {element: el};

				if (!id) {
					el.setAttribute('id', (id = guid()));
				}

				replaceNode(el, makeMarker(id));

				result.guid = id;
				return result;
			}))
		.reduce(flatten, []);
}


/**
 * Filters out all TAGs except for the ones absolutely necessary to convey the content.
 *
 * @param {string} html The content to filter
 *
 * @return {string} Filtered HTML
 */
export function filterContent (html) {

	function allowedTags (match, tag) {
		return /u|b|i|br|span|div|strong|em/i.test(tag) ? match : '';
	}

	return html
		.replace(/\s*(class|style)=".*?"\s*/ig, ' ') //strip CSS
		.replace(/<\/?([^\s>]+)[^>]*?>/gm, allowedTags) // strip all tags, except allowed
		.replace(/\s+/g, ' ');//reduce multiple spaces to single
}



/**
 * Trims a HTML block into a snippet...
 *
 * @param {string} html content to reduce.
 * @param {number} max Max characters to allow.
 * @return {string} the snippet html.
 */
export function getHTMLSnippet (html, max) {
	const markup = /(<[^\>]+>)/;
	let count = 0;

	html = html.split(markup).filter(x=> x.trim().length);

	let text = x => (count >= max) ? '' :
			((x.length + count) >= max) ?
				(x.substr(0, (max - count) - 3) + '...') :
				x;

	return html
		.reduce((out, line) => out + (markup.test(line) ? line : text(line)), '')
		.replace(/<([^\s>]+)[^>]*><\/\1>/g, '');//remove all empty nodes
}
