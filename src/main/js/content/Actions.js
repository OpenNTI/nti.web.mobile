import Logger from 'nti-util-logger';
import {parseNTIID} from 'nti-lib-ntiids';
import {getService} from 'nti-web-client';
import {dispatch} from 'nti-lib-dispatcher';
import {processContent} from 'nti-lib-content-processing';

import {load as getLibrary} from 'library/Actions';

import PageDescriptor from './PageDescriptor';
import {getPageInfo} from './Api';
import {PAGE_LOADED, PAGE_FAILED, PACKAGE_NOT_FOUND} from './Constants';


const logger = Logger.get('content:actions');


export function getPackage (id) {
	return getLibrary()
		.then(lib=> lib.getPackage(id))
		.then(pkg=> pkg ? pkg : Promise.reject(PACKAGE_NOT_FOUND));
}


/**
 *	@param {string} ntiid Content Page - NTIID
 *	@param {Package|Bundle|Instance} context - An instance of a Content/Course model
 *	@param {object} [extra] - props, or extra config to pass along
 *	@returns {void}
 */
export function loadPage (ntiid, context, extra) {
	let isAssessmentID = parseNTIID(ntiid).specific.type === 'NAQ';

	function loadPackage (id) {
		const p = context.getPackage(id);

		return p ?
				Promise.resolve(p) :
				context.refresh()
					.then(() => context.getPackage(id));
	}

	function loadTOC (id) {
		return loadPackage(id)
			.then(p => (p && p.getTableOfContents()) || Promise.reject('No Package for Page!'));
	}

	return getPageInfo(ntiid, context, extra)
		.then(pageInfo => {
			if (pageInfo.getID() !== ntiid && !isAssessmentID) {
				// We will always missmatch for assessments, since we
				// get the pageInfo for an assessment id and the server
				// returns the pageInfo that the assessment is on...
				// so lets silence this error for that case.
				logger.warn('PageInfo ID missmatch! %s != %s %o', ntiid, pageInfo.getID());
			}

			return Promise.all([
				//Load the toc
				loadTOC(pageInfo.getPackageID()),

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


function fetchResources (packet) {
	let page = packet.pageInfo;
	let get = page.getResource.bind(page);
	let requests = packet.styles.map(get);

	return Promise.all(requests)
		// .catch(reason=>{
		// 	logger.log(reason);
		// })
		.then(styles => {
			packet.styles = styles.map(css => css.replace(/#NTIContent/g, 'nti\\:content'));
			return packet;
		});
}

export function resolveNewContext (pageInfo) {
	let ntiid = pageInfo.getPackageID();
	return getService()
		.then(service => service.getContextPathFor(ntiid))
		.catch(x => {
			let code = x && x.statusCode;
			if (code === 501 || code === 422) {
				logger.log('Ignored condition. Either the link did not exist, or has not been adapted to be generic.');
				return;//ignore error. do not do anything. (let the caller continue.)
			}

			return Promise.reject(x);
		});
}
