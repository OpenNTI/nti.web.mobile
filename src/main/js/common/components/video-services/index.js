'use strict';

var Url = require('url');

var kaltura = require('./kaltura');
var vimeo = require('./vimeo');
var youtube = require('./youtube');
var iframe = require('./iframe');

var kalturaRe = /^kaltura/i;
var vimeoRe = /vimeo/i;
var youtubeRe = /youtu(\.?)be/i;


function getUrl(data) {
	var src = data && data.sources[0];
	var url = src && Url.parse(src.source[0]);

	if (!data || !/^kaltura/i.test(src.service)) {
		return url;
	}

	url = Url.parse('');
	url.protocol = src.service;
	url.host = '//';
	url.pathname = src.source[0];

	return url;
}


exports = module.exports = {
	Kaltura: kaltura,
	Vimeo: vimeo,
	YouTube: youtube,


	getHandler: function(src) {
		var url = (typeof src === 'string') ? Url.parse(src) : getUrl(src);
		var handler = iframe;

		if (url) {
			if (kalturaRe.test(url.protocol)) {
				handler = kaltura;
			}
			else if (vimeoRe.test(url.host)) {
				handler = vimeo;
			}
			else if (youtubeRe.test(url.host)) {
				handler = youtube;
			}
		}

		return handler;
	},


	getUrl: getUrl

};
