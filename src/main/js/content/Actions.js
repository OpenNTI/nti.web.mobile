'use strict';
/** @module content/Actions */


var Utils = require('common/Utils');
var DomUtils = Utils.Dom;

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var guid = require('dataserverinterface/utils/guid');
var indexArrayByKey = require('dataserverinterface/utils/array-index-by-key');
var toArray = require('dataserverinterface/utils/toarray');

var Api = require('./Api');
var Constants = require('./Constants');
var PageDescriptor = require('./PageDescriptor');

var LibraryApi = require('library/Api');


var MARKER_REGEX = /nti:widget-marker\[([^\]\>]+)\]/i;
var WIDGET_MARKER_REGEX = /<!--(?:[^\]>]*)(nti:widget-marker\[(?:[^\]\>]+)\])(?:[^\]>]*)-->/ig;

var WIDGET_SELECTORS_AND_STRATEGIES = {
	'[itemprop~=nti-data-markupenabled],[itemprop~=nti-slide-video]': parseFramedElement,

	'object[type$=nticard]': DomUtils.parseDomObject,
	'object[type$=ntislidedeck]': DomUtils.parseDomObject,
	'object[type$=ntislidevideo][itemprop=presentation-card]': DomUtils.parseDomObject,
	'object[type$=ntivideo][itemprop=presentation-video]': DomUtils.parseDomObject,
	'object[type$=videoroll]': DomUtils.parseDomObject,
	'object[type$=image-collection]': DomUtils.parseDomObject,
	'object[class=ntirelatedworkref]': DomUtils.parseDomObject,

	'object[type$=ntisequenceitem]': DomUtils.parseDomObject,
	'object[type$=ntiaudio]': DomUtils.parseDomObject,
	'object[type*=naquestion]': DomUtils.parseDomObject,
};

/**
 * Actions available to views for content-related functionality.
 */
module.exports = Object.assign(EventEmitter.prototype, {

	/**
	 *	@param {String} Content Page NTIID
	 */
	loadPage: function(ntiid) {
		Promise.all([
			LibraryApi.getLibrary(),
			Api.getPageInfo(ntiid)
		])

			.then(function(data) {
				var lib= data[0];
				var pi = data[1];

				if (pi.getID() !== ntiid) {
					console.warn('PageInfo ID missmatch! %s != %s', ntiid, pi.getID());
				}

				var p = lib.getPackage(pi.getPackageID());

				return Promise.all([
					(p && p.getTableOfContents()) || Promise.reject('No Package for Page!'),
					pi.getContent()

				]).then(function(data){
					var toc = data[0];
					var htmlStr = data[1];
					return {
						tableOfContents: toc,
						pageInfo: pi,
						content: htmlStr
					};
				});
			})

			//get the html and split out some resource references to fetch.
			.then(processContent)

			//load css
			.then(fetchResources)


			.then(function(packet) {
				dispatch(Constants.PAGE_LOADED,
					new PageDescriptor(ntiid, packet));
			});
	}

});


function dispatch(key, data) {
	AppDispatcher.handleRequestAction({
		type: key,
		response: data
	});
}


function processContent(packet) {
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
					.map(function(i){return i.getAttribute('href');});

	var widgets = indexArrayByKey(parseWidgets(doc, elementFactory), 'guid');

	var bodyParts = body.innerHTML.split(WIDGET_MARKER_REGEX).map(function (part) {
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


function fetchResources(packet) {
	var page = packet.pageInfo;
	var get = page.getResource.bind(page);
	var requests = packet.styles.map(get);

	return Promise.all(requests)
		// .catch(function(reason) {
		// 	console.log(reason);
		// })
		.then(function(styles) {
		packet.styles = styles;
		return packet;
	});
}


function parseWidgets(doc, elementFactory) {
	var strategies = WIDGET_SELECTORS_AND_STRATEGIES;

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

	return Object.keys(strategies).map(function(selector) {

		return toArray(doc.querySelectorAll(selector)).map(function(el) {
			var id = el.getAttribute('id');
			var result = strategies[selector](el);

			if (!id) {
				el.setAttribute('id', (id = guid()));
			}

			DomUtils.replaceNode(el, makeMarker(id));

			result.guid = id;
			return result;
		});

	}).reduce(flatten, []);
}


function parseFramedElement(el) {
	//This should always be a <span><img/></span> construct:
	// <span itemprop="nti-data-markupenabled">
	// 	<img crossorigin="anonymous"
	// 		data-nti-image-full="resources/CHEM..."
	// 		data-nti-image-half="resources/CHEM..."
	// 		data-nti-image-quarter="resources/CHEM..."
	// 		data-nti-image-size="actual"
	// 		id="bbba3b97a2251587d4a483af98cb398c"
	// 		src="/content/sites/platform.ou.edu/CHEM..."
	// 		style="width:320px; height:389px">
	// </span>

	function flat(o, i) {
		return o || (Array.isArray(i) ? i.reduce(flat) : i);
	}

	var data = DomUtils.parseDomObject(el);

	data.item = [
		DomUtils.getImagesFromDom(el),
		DomUtils.getVideosFromDom(el)
	].reduce(flat, null) || {};

	if (!data.type) {
		data.type = data.itemprop;
	}

	return data;
}
