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

		var courseId = course.getID();

		// do we already have a promise for loading this course's discussions?
		var promise = _promises[courseId];
		
		// if not, create one.
		if (!promise) {
			console.debug('new promise for getting course discussions: %s (%s)', (course.getPresentationProperties()||{ title: 'unknown title'}).title, courseId);
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

	addComment(topic, parent, comment) {
		return topic.addComment(comment, parent).then(result=>{
			console.debug(result);
			Store.commentAdded({
				topic: topic,
				parent: parent,
				result: result
			});
		},
		reason => {
			console.debug(reason);
		});
	},

	createTopic(forum, topic) {
		return forum.createTopic(topic).then(
			result => {
				Store.emitChange({
					type: Constants.TOPIC_CREATED,
					topic: result,
					forum: forum
				});
				this.getObjectContents(forum.getID());
			}.bind(this)
		);
	},

	deleteTopic(topic) {
		return this._deleteObject(topic);
	},

	_deleteObject(o) {
		var link = o && o.getLink && o.getLink('edit');
		if (!link) {
			console.error('No edit link. Ignoring delete request.');
			return;
		}
		var del = getService().then(service => {
			return service.delete(link);
		});

		return del.then(() => {
			Store.deleteObject(o);
		});
	},

	deleteComment(comment) {
		return this._deleteObject(comment);
	},

	getObjectContents: function(ntiid, params) {
		return this.getObject(ntiid).then(object => {
			Store.setObject(ntiid, object);
			return object.getContents(params).then(contents => {
				Store.setObjectContents(ntiid, contents);
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
