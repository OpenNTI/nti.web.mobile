import {parseNTIID} from 'nti.lib.interfaces/utils/ntiids';

import AppDispatcher from 'dispatcher/AppDispatcher';

import PageDescriptor from './PageDescriptor';

import {getPageInfo} from './Api';
import {PAGE_LOADED, PAGE_FAILED, PACKAGE_NOT_FOUND} from './Constants';

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
 *	@param {string} ntiid Content Page NTIID
 *	@returns {void}
 */
export function loadPage (ntiid) {
	let isAssessmentID = parseNTIID(ntiid).specific.type === 'NAQ';

	return Promise.all([
		getLibrary(),
		getPageInfo(ntiid)
	])

		.then(data => {
			let [lib, pageInfo] = data;

			if (pageInfo.getID() !== ntiid && !isAssessmentID) {
				// We will always missmatch for assessments, since we
				// get the pageInfo for an assessment id and the server
				// returns the pageInfo that the assessment is on...
				// so lets silence this error for that case.
				console.warn('PageInfo ID missmatch! %s != %s %o', ntiid, pageInfo.getID());
			}

			let p = lib.getPackage(pageInfo.getPackageID());


			return Promise.all([
				//Load the toc
				(p && p.getTableOfContents()) || Promise.reject('No Package for Page!'),

				//Load the page html
				getPageContent(pageInfo),

				//Get the data store. (Important note: the store itself will load in parallel
				// (and not block page render))
				pageInfo.getUserData()

			]).then(pack => {
				let [tableOfContents, packet, userDataStore] = pack;
				return Object.assign(packet, { tableOfContents, userDataStore });
			});
		})

		.then(packet => {
			let data = new PageDescriptor(ntiid, packet);
			dispatch(PAGE_LOADED, data);
			return data;
		})

		.catch(error => {
			dispatch(PAGE_FAILED, {error, ntiid});
			return Promise.reject(error);
		});
}


export function getPageContent (pageInfo) {
	return pageInfo.getContent()
		.then(content => ({pageInfo, content}))
		//get the html and split out some resource references to fetch.
		.then(processContent)
		//load css
		.then(fetchResources);
}


function fetchResources(packet) {
	let page = packet.pageInfo;
	let get = page.getResource.bind(page);
	let requests = packet.styles.map(get);

	return Promise.all(requests)
		// .catch(reason=>{
		// 	console.log(reason);
		// })
		.then(styles => {
			packet.styles = styles;
			return packet;
		});
}
