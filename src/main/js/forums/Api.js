'use strict';

var Store = require('./Store');
var getService = require('common/Utils').getService;
var Constants = require('./Constants');

var _promises = {};

// called when the load promise is resolved or rejected.
function _discussionsLoaded(courseId, result) {
	Store.setDiscussions(courseId, result);
	return result;
}

module.exports = {
	loadDiscussions(course) {

		// do we already have a promise for loading this course's discussions?
		var promise = _promises[course];
		
		// if not, create one.
		if (!promise) {
			var courseId = course.getID();
			promise = course.getDiscussions()
				.then( result => {
						_discussionsLoaded(courseId, result);
					},
					reason => {
						// don't hang on to a rejected promise; we want to try again next time.
						delete _promises[course]; 
						_discussionsLoaded(courseId, reason);
					}
				);
			// keep this promise around so we're not making redundant calls.
			_promises[course] = promise;
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

	getObjectContents: function(ntiid, params) {
		return this.getObject(ntiid).then(object => {
			return object.getContents(params).then(contents => {
				Store.emitChange({
					type: Constants.OBJECT_CONTENTS_LOADED,
					object: object,
					contents: contents
				});
			});
		});
	},

	getObject: function(ntiid) {
		return this._getInterface()
			.then(f => {
				return f.getObject(ntiid)
					.then(object => {
						Store.emitChange({
							type: Constants.OBJECT_LOADED,
							ntiid: ntiid,
							object: object
						});
						return object;
					});
			});
	}

};
