import {parseNTIID} from 'nti.lib.interfaces/utils/ntiids';

import AppDispatcher from 'dispatcher/AppDispatcher';

import PageDescriptor from './PageDescriptor';

import {getPageInfo} from './Api';
import {PAGE_LOADED, PACKAGE_NOT_FOUND} from './Constants';

import {processContent} from './utils';

import {getLibrary} from 'library/Api';

function dispatch(type, response) {
	AppDispatcher.handleRequestAction({type, response});
}


export function getPackage (id) {
	return getLibrary()
		.then(lib=> lib.getPackage(id))
		.then(pkg=> pkg ? pkg : Promise.reject(PACKAGE_NOT_FOUND));
}


/**
 *	@param {string} Content Page NTIID
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
				//Load the toc
				(p && p.getTableOfContents()) || Promise.reject('No Package for Page!'),

				//Load the page html
				pi.getContent(),

				//Get the data store. (Important note: the store itself will load in parallel
				// (and not block page render))
				pi.getUserData()
			]).then(pack => {
				let [toc, htmlStr, ugd] = pack;
				return {
					tableOfContents: toc,
					pageInfo: pi,
					content: htmlStr,
					userDataStore: ugd
				};
			});
		})

		//get the html and split out some resource references to fetch.
		.then(processContent)

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
