import parseDomObject from './object';
import getImagesFromDom from './image';
import getVideosFromDom from './video';

export default function parseFramedElement(el) {
	//This should always be a <span><img/></span> construct:
	// <span itemprop="nti-data-markup(enabled|disabled)">
	// 	<img crossorigin="anonymous"
	// 		data-nti-image-full="resources/CHEM..."
	// 		data-nti-image-half="resources/CHEM..."
	// 		data-nti-image-quarter="resources/CHEM..."
	// 		data-nti-image-size="actual"
	// 		id="bbba3b97a2251587d4a483af98cb398c"
	// 		src="/content/sites/platform.ou.edu/CHEM..."
	// 		style="width:320px; height:389px">
	// </span>

	let flat = (o, i) => o || (Array.isArray(i) ? i.reduce(flat) : i);

	let data = parseDomObject(el);

	data.item = [
		getImagesFromDom(el),
		getVideosFromDom(el)
	].reduce(flat, null) || {};

	if (!data.type) {
		data.type = data.itemprop;
	}

	return data;
}
