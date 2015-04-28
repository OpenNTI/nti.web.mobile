import parseDomObject from './object';

export default function getImagesFromDom (contentElement) {
	let imageObjects = [];

	Array.from(contentElement.querySelectorAll('span > img')).forEach(i =>
		imageObjects.push(parseDomObject(i)));
	return imageObjects;
}
