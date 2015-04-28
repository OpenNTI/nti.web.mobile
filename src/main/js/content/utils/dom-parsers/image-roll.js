import parseDomObject from './object';
import getImagesFromDom from './image';

export default function parseElement(el) {

	console.log(getImagesFromDom(el));

	return parseDomObject(el);
}
