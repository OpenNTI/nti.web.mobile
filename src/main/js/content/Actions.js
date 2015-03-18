/**
 * Actions available to views for content-related functionality.
 */

import {
	parseDomObject,
	getImagesFromDom,
	getVideosFromDom
} from 'common/utils/dom';

import {parseNTIID} from 'dataserverinterface/utils/ntiids';

import AppDispatcher from 'dispatcher/AppDispatcher';

import PageDescriptor from './PageDescriptor';

import {getPageInfo} from './Api';
import {PAGE_LOADED} from './Constants';
import {processContent} from './Utils';

import {getLibrary} from 'library/Api';

const WIDGET_SELECTORS_AND_STRATEGIES = {
	'[itemprop~=nti-data-markupenabled],[itemprop~=nti-slide-video]': parseFramedElement,

	'object[type$=nticard]': parseDomObject,
	'object[type$=ntislidedeck]': parseDomObject,
	'object[type$=ntislidevideo][itemprop=presentation-card]': parseDomObject,
	'object[type$=ntivideo][itemprop=presentation-video]': parseDomObject,
	'object[type$=videoroll]': parseDomObject,
	'object[type$=image-collection]': parseDomObject,
	'object[class=ntirelatedworkref]': parseDomObject,

	'object[type$=ntisequenceitem]': parseDomObject,
	'object[type$=ntiaudio]': parseDomObject,
	'object[type*=naquestion]': parseDomObject,
};


function dispatch(type, response) {
	AppDispatcher.handleRequestAction({type, response});
}


/**
 *	@param {String} Content Page NTIID
 */
export function loadPage (ntiid) {
	let isAssessmentID = parseNTIID(ntiid).specific.type === 'NAQ';

	Promise.all([
		getLibrary(),
		getPageInfo(ntiid)
	])

		.then(data => {
			let [lib, pi] = data;

			if (pi.getID() !== ntiid && !isAssessmentID) {
				// We will always missmatch for assessments, since we
				// get the pageInfo for an assessment id and the server
				// returns the pageInfo that the assessment is on...
				// so lets silence this error for that case.
				console.warn('PageInfo ID missmatch! %s != %s %o', ntiid, pi.getID());
			}

			let p = lib.getPackage(pi.getPackageID());

			return Promise.all([
				(p && p.getTableOfContents()) || Promise.reject('No Package for Page!'),
				pi.getContent()

			]).then(data => {
				let [toc, htmlStr] = data;
				return {
					tableOfContents: toc,
					pageInfo: pi,
					content: htmlStr
				};
			});
		})

		//get the html and split out some resource references to fetch.
		.then(processContent.bind(this, WIDGET_SELECTORS_AND_STRATEGIES))

		//load css
		.then(fetchResources)


		.then(packet =>
			dispatch(PAGE_LOADED,
				new PageDescriptor(ntiid, packet)));
}


function fetchResources(packet) {
	let page = packet.pageInfo;
	let get = page.getResource.bind(page);
	let requests = packet.styles.map(get);

	return Promise.all(requests)
		// .catch(reason=>{
		// 	console.log(reason);
		// })
		.then(styles=>{
			packet.styles = styles;
			return packet;
		});
}


function parseFramedElement(el) {
	//This should always be a <span><img/></span> construct:
	// <span itemprop="nti-data-markupenabled">
	// 	<img crossorigin="anonymous"
	// 		data-nti-image-full="resources/CHEM..."
	// 		data-nti-image-half="resources/CHEM..."
	// 		data-nti-image-quarter="resources/CHEM..."
	// 		data-nti-image-size="actual"
	// 		id="bbba3b97a2251587d4a483af98cb398c"
	// 		src="/content/sites/platform.ou.edu/CHEM..."
	// 		style="width:320px; height:389px">
	// </span>

	function flat(o, i) {
		return o || (Array.isArray(i) ? i.reduce(flat) : i);
	}

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
