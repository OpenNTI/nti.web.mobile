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

	loadDiscussions(course) {
		if (!course) {
			return Promise.reject('Course not specified.');
		}
		let courseId = course.getID();

		// do we already have a promise for loading this course's discussions?
		let promise = promises[courseId];

		// if not, create one.
		if (!promise) {
			let courseId = course.getID();
			promise = course.getDiscussions()
				.then(
					result => {
						return result;
						// _discussionsLoaded(courseId, result);
					},
					reason => {
						// don't hang on to a rejected promise; we want to try again next time.
						delete promises[course];
						return reason;
						// _discussionsLoaded(courseId, reason);
					}
				);
			// keep this promise around so we're not making redundant calls.
			promises[courseId] = promise;
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

	deleteObject(o) {
		let link = o && o.getLink && o.getLink('edit');
		if (!link) {
			console.error('No edit link. Ignoring delete request.');
			return;
		}
		return getService().then(service => {
			return service.delete(link);
		});
	},

	reportItem(o) {
		return this[GetInterface]().then(f => f.reportItem(o));
	},

	// convenience method that just adds params to the getObjectContents call.
	getTopicContents: function(topicId, batchStart=0, batchSize=50) {
		return this.getPagedContents(topicId, batchStart, batchSize);
	},

	getForumContents(forumId, batchStart, batchSize) {
		return this.getPagedContents(forumId, batchStart, batchSize);
	},

	getPagedContents(ntiid, batchStart=0, batchSize=defaultBatchSize) {
		let params = Object.assign(
			{},
			defaultPagingParams,
			{batchStart, batchSize}
		);
		return this.getObjectContents(ntiid, params);
	},

	getObjectContents: function(ntiid, params) {
		return this.getObject(ntiid).then(object => {
			return object.getContents(params).then(contents => {
				return { object: object, contents: contents, params: params};
			});
		});
	},

	getObject: function(ntiid) {
		return this[GetInterface]().then(f => f.getObject(ntiid));
	},

	getObjects: function(ntiids) {
		return this[GetInterface]().then(f => f.getObjects(ntiids));
	}

};
