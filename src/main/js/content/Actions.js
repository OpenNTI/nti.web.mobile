'use strict';
/** @module content/Actions */
var Promise = global.Promise || require('es6-promise').Promise;

var merge = require('react/lib/merge')

var DomUtils = require('common/Utils').Dom;

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var guid = require('dataserverinterface/utils/guid');
var toArray = require('dataserverinterface/utils/toarray');

var Api = require('./Api');
var Constants = require('./Constants');

var LibraryApi = require('library/Api');


var WIDGET_SELECTORS_AND_STRATEGIES = {
	'object[type$=nticard]': DomUtils.parseDomObject,
	'object[type$=ntislidedeck]': DomUtils.parseDomObject,
	'object[type$=ntislidevideo][itemprop=presentation-card]': DomUtils.parseDomObject,
	'object[type$=ntivideo][itemprop=presentation-video]': DomUtils.parseDomObject,
	'object[type$=videoroll]': DomUtils.parseDomObject,
	'object[type$=image-collection]': DomUtils.parseDomObject,
	'object[class=ntirelatedworkref]': DomUtils.parseDomObject,

	'object[type$=ntisequenceitem]': function() {},
	'object[type$=ntiaudio]': function() {},

	'[itemprop~=nti-data-markupenabled],[itemprop~=nti-slide-video]': function() {}
};


/**
 * Actions available to views for content-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {

	/**
	 *	@param {String} Content Page NTIID
	 */
	loadPage: function(ntiid) {

		Api.getPageInfo(ntiid)
			.then(function(pi) {
				if (pi.getID() !== ntiid) {
					console.warn('PageInfo ID missmatch! %s != %s', ntiid, pi.getID());
				}

				return pi.getContent().then(function(html){
					return {
						pageInfo: pi,
						content: html
					};
				});
			})

			//get the html and split out some resource references to fetch.
			.then(processContent)

			//load css
			.then(fetchResources)


			.then(function(packet) {
				dispatch(Constants.PAGE_LOADED,
					merge({ ntiid: ntiid }, packet));
			});
	}

});


function dispatch(key, data) {
	AppDispatcher.handleRequestAction({
		actionType: key,
		response: data
	});
}


var BODY_REGEX = /<body[^>]+>(.*)<\/body/i;
var STYLE_REGEX = /<link[^>]+href="([^"]+css)"[^>]*>/ig;

function processContent(packet) {
	var html = packet.content;
	if (typeof DOMParser === 'undefined') {
		//If there is not a dom parser, we will fallback to RegExp parsing...
		//for now, this fallback will not support widgets.
		return merge(packet, {
			content: BODY_REGEX.exec(html)[1],
			styles: html.match(STYLE_REGEX).map(function(i){
				STYLE_REGEX.lastIndex = 0;//reset
				return (STYLE_REGEX.exec(i) || [])[1];
			})
		});

	}

	var doc = new DOMParser().parseFromString(html, 'text/html');
	var body = doc.getElementsByTagName('body')[0];
	var styles = toArray(doc.querySelectorAll('link[rel=stylesheet]'))
					.map(function(i){return i.getAttribute('href');});

	var widgets = parseWidgets(doc);


	return merge(packet, {
		content: body.innerHTML,
		styles: styles,
		widgets: widgets
	});
}


function fetchResources(packet) {
	var page = packet.pageInfo;
	var get = page.getResource.bind(page);
	var requests = packet.styles.map(get);

	return Promise.all(requests).then(function(styles) {
		packet.styles = styles;
		return packet;
	});
}


function parseWidgets(doc) {
	var strategies = WIDGET_SELECTORS_AND_STRATEGIES;

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

			result['attribute-id'] = id;
			return result;
		});

	}).reduce(flatten, []);
}
