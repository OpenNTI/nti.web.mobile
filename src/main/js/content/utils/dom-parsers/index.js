import parseDomObject from './object';
import parseFramedElement from './framed-elements';
import parseImageRoll from './image-roll';
import parseVideoRoll from './video-roll';

//Widget Selectors =to=> Strategies (parsers)
export default {
	//Keys will enumerate in source/insertion order.
	'object[class=ntirelatedworkref]': parseDomObject,
	'object[type$=nticard]': parseDomObject,

	'object[type$=ntislidedeck]': parseDomObject,
	'object[type$=ntislidevideo][itemprop=presentation-card]': parseDomObject,
	'object[type$=ntivideo][itemprop=presentation-video]': parseDomObject,

	'object[type$=videoroll]': parseVideoRoll,
	'object[type$=image-collection]': parseImageRoll,

	'object[type$=ntisequenceitem]': parseDomObject,
	'object[type$=ntiaudio]': parseDomObject,

	'object[type*=naquestion]': parseDomObject,

	'[itemprop*=nti-data-markup],[itemprop~=nti-slide-video]': parseFramedElement
};
