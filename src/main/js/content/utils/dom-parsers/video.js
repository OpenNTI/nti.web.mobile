import {getModel} from 'nti.lib.interfaces';

import parseDomObject from './object';

import {getServer} from 'common/utils';

const Video = getModel('video');

export default function getVideosFromDom (contentElement) {
	let videoQS = 'object .naqvideo, object .ntivideo',
		sourceQS = 'object[type$=videosource]',
		videoObjects = [];

	function fixType(o) {
		o.MimeType = o.MimeType || o.type;
	}

	if (contentElement) {
		Array.from(contentElement.querySelectorAll(videoQS)).forEach(v => {
			let o = parseDomObject(v),
				s = o.sources = [];

			fixType(o);
			o.ntiid = o.ntiid || o.dataset.ntiid;

			for (let source of Array.from(v.querySelectorAll(sourceQS))) {
				source = parseDomObject(source);
				fixType(s);
				s.push(source);
			}

			o = new Video(getServer(), null, o);
			videoObjects.push(o);
		});
	}

	return videoObjects;
}
