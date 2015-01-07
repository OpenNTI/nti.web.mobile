'use strict';

var Store = require('./Store');

var _promises = {};

// called when the load promise is resolved or rejected.
function _discussionsLoaded(result) {
	Store.setDiscussions(result);
	return result;
}

module.exports = {
	loadDiscussions(course) {

		// do we already have a promise for loading this course's discussions?
		var promise = _promises[course];
		
		// if not, create one.
		if (!promise) {
			promise = course.getDiscussions()
				.then(_discussionsLoaded, reason => {
					// don't hang on to a rejected promise; we want to try again next time.
					delete _promises[course]; 
					_discussionsLoaded(reason);
				});
			// keep this promise around so we're not making redundant calls.
			_promises[course] = promise;
		}

		return promise;
	},

	loadForumContents(course, forumId) {
		var getForum = this.loadDiscussions(course)
			.then(() => {
				var forum = Store.getForum(forumId);
				if (!forum) {
					return Promise.reject('Forum not avaiable in Store?', forumId);
				}
				return forum;
			});

		getForum.then(forum => {
			forum.getContents()
				.then(contents => {
					Store.setForumContents(forumId, contents);
				},
				reason => {
					Store.setForumContents(forumId, reason);
				});
		});
	}
};
