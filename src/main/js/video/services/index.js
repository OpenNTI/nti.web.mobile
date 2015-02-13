import Url from 'url';

import kaltura from './kaltura';
import vimeo from './vimeo';
import youtube from './youtube';

const kalturaRe = /^kaltura/i;
const vimeoRe = /vimeo/i;
const youtubeRe = /youtu(\.?)be/i;


export function getUrl(data) {
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

const serviceMap = {
	youtube: youtube,
	vimeo: vimeo,
	kaltura: kaltura
};

// var getVimeoId = vimeo.getId;
// var getYouTubeId = youtube.getId;


export function getHandler(src) {
	var url = (typeof src === 'string') ? Url.parse(src) : getUrl(src);
	var service = ((src.sources || [])[0] || {}).service;

	var handler = serviceMap[service];

	if (url && !handler) {
		handler = null;
		if (kalturaRe.test(url.protocol)) {
			handler = kaltura;
		}

		else if (vimeoRe.test(url.host) || vimeoRe.test(url.protocol)) {
			handler = vimeo;
		}

		else if (youtubeRe.test(url.host)) {
			handler = youtube;
		}
	}

	return handler;
}
