/**
 * Actions available to views for content-related functionality.
 */

import {Dom} from 'common/Utils';
var DomUtils = Dom;

import {parseNTIID} from 'dataserverinterface/utils/ntiids';

import AppDispatcher from 'dispatcher/AppDispatcher';

import PageDescriptor from './PageDescriptor';

import {getPageInfo} from './Api';
import {PAGE_LOADED} from './Constants';
import {processContent} from './Utils';

import {getLibrary} from 'library/Api';

const WIDGET_SELECTORS_AND_STRATEGIES = {
	'[itemprop~=nti-data-markupenabled],[itemprop~=nti-slide-video]': parseFramedElement,

	'object[type$=nticard]': DomUtils.parseDomObject,
	'object[type$=ntislidedeck]': DomUtils.parseDomObject,
	'object[type$=ntislidevideo][itemprop=presentation-card]': DomUtils.parseDomObject,
	'object[type$=ntivideo][itemprop=presentation-video]': DomUtils.parseDomObject,
	'object[type$=videoroll]': DomUtils.parseDomObject,
	'object[type$=image-collection]': DomUtils.parseDomObject,
	'object[class=ntirelatedworkref]': DomUtils.parseDomObject,

	'object[type$=ntisequenceitem]': DomUtils.parseDomObject,
	'object[type$=ntiaudio]': DomUtils.parseDomObject,
	'object[type*=naquestion]': DomUtils.parseDomObject,
};


function dispatch(type, response) {
	AppDispatcher.handleRequestAction({type, response});
}


/**
 *	@param {String} Content Page NTIID
 */
export function loadPage (ntiid) {
	var isAssessmentID = parseNTIID(ntiid).specific.type === 'NAQ';

	Promise.all([
		getLibrary(),
		getPageInfo(ntiid)
	])

		.then(data => {
			var lib= data[0];
			var pi = data[1];

			if (pi.getID() !== ntiid && !isAssessmentID) {
				// We will always missmatch for assessments, since we
				// get the pageInfo for an assessment id and the server
				// returns the pageInfo that the assessment is on...
				// so lets silence this error for that case.
				console.warn('PageInfo ID missmatch! %s != %s %o', ntiid, pi.getID());
			}

			var p = lib.getPackage(pi.getPackageID());

			return Promise.all([
				(p && p.getTableOfContents()) || Promise.reject('No Package for Page!'),
				pi.getContent()

			]).then(data => {
				var toc = data[0];
				var htmlStr = data[1];
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
	var page = packet.pageInfo;
	var get = page.getResource.bind(page);
	var requests = packet.styles.map(get);

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

	var data = DomUtils.parseDomObject(el);

	data.item = [
		DomUtils.getImagesFromDom(el),
		DomUtils.getVideosFromDom(el)
	].reduce(flat, null) || {};

	if (!data.type) {
		data.type = data.itemprop;
	}

	return data;
}
