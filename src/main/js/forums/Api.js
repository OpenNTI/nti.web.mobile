import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import {getService} from 'common/utils';

const DEFAULT_BATCH_SIZE = 20;

export const DEFAULT_PAGING_PARAMS = {
	sortOn: 'NewestDescendantCreatedTime',
	sortOrder: 'descending',
	filter: 'TopLevel',
	batchStart: 0,
	batchSize: DEFAULT_BATCH_SIZE
};

let promises = {};

export function loadDiscussions (pkg) {
	if (!pkg) {
		return Promise.reject('Package not specified.');
	}
	let pkgId = pkg.getID();

	// do we already have a promise for loading this pkg's discussions?
	let promise = promises[pkgId];

	// if not, create one.
	if (!promise) {
		promise = pkg.getDiscussions()
			.then(
				result => {
					return result;
					// _discussionsLoaded(pkgId, result);
				},
				reason => {
					// don't hang on to a rejected promise; we want to try again next time.
					delete promises[pkgId];
					return reason;
					// _discussionsLoaded(pkgId, reason);
				}
			);
		// keep this promise around so we're not making redundant calls.
		promises[pkgId] = promise;
	}

	return promise;
}


// convenience method that just adds params to the getObjectContents call.
export function getTopicContents (topicId, batchStart = 0, batchSize = 50) {
	return getPagedContents(topicId, batchStart, batchSize);
}

export function getForumContents (forumId, batchStart, batchSize) {
	return getPagedContents(forumId, batchStart, batchSize);
}

export function getPagedContents (ntiid, batchStart = 0, batchSize = DEFAULT_BATCH_SIZE) {
	let params = Object.assign(
		{},
		DEFAULT_PAGING_PARAMS,
		{batchStart, batchSize}
	);
	return getObjectContents(ntiid, params);
}


export function getObjectContents (ntiid, params) {
	return getObject(ntiid).then(object =>
		object.getContents(params).then(contents => ({ object, contents, params})));
}

export function getObject (ntiid) {
	return getService().then(s => s.getParsedObject(decodeFromURI(ntiid)));
}

export function getObjects (ntiids) {
	return getService().then(s => s.getParsedObjects(ntiids.map(decodeFromURI)));
}
