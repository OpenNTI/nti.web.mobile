'use strict';

var Store = require('./Store');
var getService = require('common/Utils').getService;
var Constants = require('./Constants');

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
				.then(
					_discussionsLoaded,
					reason => {
						// don't hang on to a rejected promise; we want to try again next time.
						delete _promises[course]; 
						_discussionsLoaded(reason);
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

	getObjectContents: function(ntiid) {
		return this.getObject(ntiid).then(object => {
			return object.getContents().then(contents => {
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
