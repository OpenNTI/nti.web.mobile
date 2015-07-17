import {getService} from 'common/utils';

const GetInterface = 'forum:api:getInterface';

let promises = {};

const defaultBatchSize = 20;

export const defaultPagingParams = {
	sortOn: 'CreatedTime',
	sortOrder: 'ascending',
	filter: 'TopLevel',
	batchStart: 0,
	batchSize: defaultBatchSize
};

export default {

	loadDiscussions(pkg) {
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
	},

	[GetInterface]() {
		let me = this[GetInterface];
		if (!me.promise) {
			me.promise = getService().then(service => (service.forums));
		}
		return me.promise;
	},

	deleteObject (o) {
		let link = o && o.getLink && o.getLink('edit');
		if (!link) {
			console.error('No edit link. Ignoring delete request.');
			return;
		}
		return getService().then(service => {
			return service.delete(link);
		});
	},

	reportItem (o) {
		return this[GetInterface]().then(f => f.reportItem(o));
	},

	// convenience method that just adds params to the getObjectContents call.
	getTopicContents (topicId, batchStart=0, batchSize=50) {
		return this.getPagedContents(topicId, batchStart, batchSize);
	},

	getForumContents (forumId, batchStart, batchSize) {
		return this.getPagedContents(forumId, batchStart, batchSize);
	},

	getPagedContents (ntiid, batchStart=0, batchSize=defaultBatchSize) {
		let params = Object.assign(
			{},
			defaultPagingParams,
			{batchStart, batchSize}
		);
		return this.getObjectContents(ntiid, params);
	},

	getObjectContents (ntiid, params) {
		return this.getObject(ntiid).then(object => {
			return object.getContents(params).then(contents => {
				return { object: object, contents: contents, params: params};
			});
		});
	},

	getObject (ntiid) {
		return this[GetInterface]().then(f => f.getObject(ntiid));
	},

	getObjects (ntiids) {
		return this[GetInterface]().then(f => f.getObjects(ntiids));
	}

};
