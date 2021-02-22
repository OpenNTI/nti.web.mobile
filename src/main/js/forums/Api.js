import { decodeFromURI } from '@nti/lib-ntiids';
import { getService } from '@nti/web-client';

const DEFAULT_BATCH_SIZE = 20;
const DEFAULT_SORT_ORDER = 'descending';

export const DEFAULT_PAGING_PARAMS = {
	sortOn: 'NewestDescendantCreatedTime',
	sortOrder: DEFAULT_SORT_ORDER,
	filter: 'TopLevel',
	batchStart: 0,
	batchSize: DEFAULT_BATCH_SIZE,
};

export function loadDiscussions(pkg) {
	if (!pkg) {
		return Promise.reject('Package not specified.');
	}

	return pkg.getDiscussions().then(
		result => {
			return result;
		},
		reason => {
			return reason;
		}
	);
}

// convenience method that just adds params to the getForumItemContents call.
export function getTopicContents(topicId, batchStart = 0, batchSize = 50) {
	return getPagedContents(
		topicId,
		batchStart,
		batchSize,
		'ascending',
		'CreatedTime'
	);
}

export function getForumContents(forumId, batchStart, batchSize) {
	return getPagedContents(forumId, batchStart, batchSize);
}

export function getPagedContents(
	ntiid,
	batchStart = 0,
	batchSize = DEFAULT_BATCH_SIZE,
	sortOrder = DEFAULT_SORT_ORDER,
	sortOn = DEFAULT_PAGING_PARAMS.sortOn
) {
	let params = {
		...DEFAULT_PAGING_PARAMS,
		batchStart,
		batchSize,
		sortOrder,
		sortOn,
	};
	return getForumItemContents(ntiid, params);
}

export function getForumItemContents(ntiid, params) {
	return getForumItem(ntiid).then(item =>
		item.getContents(params).then(contents => ({ item, contents, params }))
	);
}

export function getForumItem(ntiid) {
	return getService().then(s => s.getObject(decodeFromURI(ntiid)));
}

export function getForumItems(ntiids) {
	return getService().then(s => s.getObjects(ntiids.map(decodeFromURI)));
}
