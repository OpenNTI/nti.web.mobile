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
		var url = Url.parse(src);
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
	}
}
