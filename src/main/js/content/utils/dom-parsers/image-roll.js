import parseDomObject from './object';
import getImagesFromDom from './image';

export default function parseElement(el) {
	let data = parseDomObject(el);

	data.images = getImagesFromDom(el);

	return data;
}
