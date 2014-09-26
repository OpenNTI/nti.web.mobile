'use strict';
/** @module content/Actions */
var Promise = global.Promise || require('es6-promise').Promise;

var merge = require('react/lib/merge')

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var toArray = require('dataserverinterface/utils/toarray');

var Api = require('./Api');
var Constants = require('./Constants');

var LibraryApi = require('library/Api');

/**
 * Actions available to views for content-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {

	/**
	 *	@param {String} Content Page NTIID
	 */
	loadPage: function(ntiid) {
		var pageInfo
		Api.getPageInfo(ntiid)
			.then(function(pi) {
				if (pi.getID() !== ntiid) {
					console.warn('PageInfo ID missmatch! %s != %s', ntiid, pi.getID());
				}

				pageInfo = pi;
				return pi.getContent();
			})

			//get the html and split out some resource references to fetch.
			.then(processContent)


			.then(function(packet) {

				return Promise.all(packet.styles.map(function(s) {
					return pageInfo.getResource(s);
				}))

				.then(function(styles) {

					packet.styles = styles;

					return packet;
				});
			})


			.then(function(packet) {
				dispatch(Constants.PAGE_LOADED,
					merge(
						{
							ntiid: ntiid,
							pageInfo: pageInfo
						},
						packet
					)
				);
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

function processContent(html) {
	if (typeof DOMParser === 'undefined') {
		return {
			content: BODY_REGEX.exec(html)[1],
			styles: html.match(STYLE_REGEX).map(function(i){
				STYLE_REGEX.lastIndex = 0;//reset
				return (STYLE_REGEX.exec(i) || [])[1];
			})
		};

	}

	var doc = new DOMParser().parseFromString(html, 'text/html');
	var body = doc.getElementsByTagName('body')[0];
	var styles = toArray(doc.querySelectorAll('link[rel=stylesheet]'))
					.map(function(i){return i.getAttribute('href');});

	return {
		content: body.innerHTML,
		styles: styles
	};
}
