'use strict';

var getService = require('common/Utils').getService;

var _promises = {};

module.exports = {
	loadDiscussions(course) {

		var courseId = course.getID();

		// do we already have a promise for loading this course's discussions?
		var promise = _promises[courseId];
		
		// if not, create one.
		if (!promise) {
			console.debug('new promise for getting course discussions: %s (%s)', (course.getPresentationProperties()||{ title: 'unknown title'}).title, courseId);
			var courseId = course.getID();
			promise = course.getDiscussions()
				.then( result => {
						return result;
						// _discussionsLoaded(courseId, result);
					},
					reason => {
						// don't hang on to a rejected promise; we want to try again next time.
						delete _promises[course]; 
						return reason;
						// _discussionsLoaded(courseId, reason);
					}
				);
			// keep this promise around so we're not making redundant calls.
			_promises[courseId] = promise;
		}

		return promise;
	},

	_getInterface() {
		var me = this._getInterface;
		if (!me.promise) {
			me.promise = getService().then(service => (service.forums));
		}
		return me.promise;
	},

	deleteObject(o) {
		var link = o && o.getLink && o.getLink('edit');
		if (!link) {
			console.error('No edit link. Ignoring delete request.');
			return;
		}
		return getService().then(service => {
			return service.delete(link);
		});
	},

	reportItem(o) {
		return this._getInterface().then(f => f.reportItem(o));
	},

	// convenience method that just adds params to the getObjectContents call.
	getTopicContents: function(topicId) {
		return this.getObjectContents(topicId, {
			sortOn: 'CreatedTime',
			sortOrder: 'ascending',
			filter: 'TopLevel'
		});
	},

	getObjectContents: function(ntiid, params) {
		return this.getObject(ntiid).then(object => {
			return object.getContents(params).then(contents => {
				return { object: object, contents: contents};
			});
		});
	},

	getObject: function(ntiid) {
		return this._getInterface().then(f => f.getObject(ntiid));
	}

};
