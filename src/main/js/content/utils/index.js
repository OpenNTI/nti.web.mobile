import replaceNode from 'nti.lib.dom/lib/replacenode';
import parent from 'nti.lib.dom/lib/parent';

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
