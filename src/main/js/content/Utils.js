'use strict';

var {Dom} = require('common/Utils');

var guid = require('dataserverinterface/utils/guid');
var indexArrayByKey = require('dataserverinterface/utils/array-index-by-key');
var toArray = require('dataserverinterface/utils/toarray');

var MARKER_REGEX = /nti:widget-marker\[([^\]\>]+)\]/i;
var WIDGET_MARKER_REGEX = /<!--(?:[^\]>]*)(nti:widget-marker\[(?:[^\]\>]+)\])(?:[^\]>]*)-->/ig;


Object.assign(exports, {
	processContent: processContent,
	parseWidgets: parseWidgets
});


/**
 * Take HTML content and parse it into parts that we can render widgets into it.
 *
 * @param {Object} strategies An object where the keys are the CSS selectors for widgets, and
 *                            the values are functions to transform that selected element into
 *                            an Object used to render the Widget.
 * @param {Object} packet     Should be and object with a property named 'content' that is a string.
 */
function processContent(strategies, packet) {
	var html = packet.content;
	var parser = null;
	if (typeof DOMParser !== 'undefined') {
		parser = new DOMParser();
	}


	var doc = parser && parser.parseFromString(html, 'text/html');
	var elementFactory = doc || document;
	if (!doc) {
		doc = document.createElement('html');
		doc.innerHTML = html;
	}

	var body = doc.getElementsByTagName('body')[0];
	var styles = toArray(doc.querySelectorAll('link[rel=stylesheet]'))
					.map(i=>i.getAttribute('href'));

	var widgets = indexArrayByKey(parseWidgets(strategies, doc, elementFactory), 'guid');

	var bodyParts = body.innerHTML.split(WIDGET_MARKER_REGEX).map(part=>{
		var m = part.match(MARKER_REGEX);
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
 */
function parseWidgets(strategies, doc, elementFactory) {

	function makeMarker(id) {
		return elementFactory.createComment('nti:widget-marker[' + id + ']');
	}

	function flatten(list, array) {
		if (!Array.isArray(array)) {
			list.push(array);
		} else {
			list.push.apply(list, array);
		}
		return list;
	}

	return Object.keys(strategies).map(selector=>
		toArray(doc.querySelectorAll(selector)).map(el=>{
			var id = el.getAttribute('id');
			var result = strategies[selector](el) || {element: el};

			if (!id) {
				el.setAttribute('id', (id = guid()));
			}

			Dom.replaceNode(el, makeMarker(id));

			result.guid = id;
			return result;
		})

	).reduce(flatten, []);
}
