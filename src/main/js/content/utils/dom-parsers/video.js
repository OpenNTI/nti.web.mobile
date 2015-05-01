import parseDomObject from './object';

export default function getVideosFromDom (contentElement) {
	let videoQS = 'object .naqvideo, object .ntivideo',
		sourceQS = 'object[type$=videosource]',
		videoObjects = [];

	if (contentElement) {
		Array.from(contentElement.querySelectorAll(videoQS)).forEach(v => {
			let o = parseDomObject(v),
				s = o.sources = [];

			Array.from(v.querySelectorAll(sourceQS)).forEach(source =>
				s.push(parseDomObject(source)));

			videoObjects.push(o);
		});
	}

	return videoObjects;
}
