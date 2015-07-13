import parseDomObject from './object';
import {getVideosFromDom} from './video';

export default function parseElement(el) {
	let data = parseDomObject(el);

	data.videos = getVideosFromDom(el);

	return data;
}
