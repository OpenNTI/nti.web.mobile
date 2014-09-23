'use strict';

var Url = require('url');

var kaltura = require('./kaltura');
var vimeo = require('./vimeo');
var youtube = require('./youtube');
var iframe = require('./iframe');

var kalturaRe = /^kaltura/i;
var vimeoRe = /vimeo/i
var youtubeRe = /youtu(\.?)be/i;

exports = module.exports = {
	Kaltura: kaltura,
	Vimeo: vimeo,
	YouTube: youtube,


	getHandler: function(src) {
		var url = (typeof src === 'string') ? Url.parse(src) : getUrl(src);
		var handler = iframe;

		if (kalturaRe.test(url.protocol)) {
			handler = kaltura;
		}
		else if (vimeoRe.test(url.host)) {
			handler = vimeo;
		}
		else if (youtubeRe.test(url.host)) {
			handler = youtube;
		}

		return handler;
	},


	getUrl: getUrl

};


function getUrl(data) {
	var src = data.sources[0];
	var url = Url.parse(src.source[0]);

	if (!/^kaltura/i.test(src.service)) {
		return url;
	}

	url = Url.parse('');
	url.protocol = src.service;
	url.host = '//';
	url.pathname = src.source[0];

	return url;
}
