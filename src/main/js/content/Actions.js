import Logger from '@nti/util-logger';
import {getService} from '@nti/web-client';
import {dispatch} from '@nti/lib-dispatcher';
import {
	PAGE_LOADED,
	PAGE_FAILED,
	getPackage,
	getPageContent,
	loadPageDescriptor as load
} from '@nti/lib-content-processing';

const logger = Logger.get('content:actions');


/**
 *	@param {string} ntiid Content Page - NTIID
 *	@param {Package|Bundle|Instance} context - An instance of a Content/Course model
 *	@param {object} [extra] - props, or extra config to pass along
 *	@returns {void}
 */
export function loadPage (ntiid, context, extra) {
	return load(ntiid, context, extra)
		.then(packet => (
			dispatch(PAGE_LOADED, packet),
			packet
		))
		.catch(error => (
			dispatch(PAGE_FAILED, {error, ntiid}),
			Promise.reject(error)
		));
}

export function resolveNewContext (pageInfo) {
	const id = pageInfo.getPackageID();
	return getService()
		.then(service => service.getContextPathFor(id))
		.catch(x => {
			const code = x && x.statusCode;
			if (code === 501 || code === 422) {
				logger.log('Ignored condition. Either the link did not exist, or has not been adapted to be generic.');
				return;//ignore error. do not do anything. (let the caller continue.)
			}

			return Promise.reject(x);
		});
}

export {
	getPageContent,
	getPackage
};
