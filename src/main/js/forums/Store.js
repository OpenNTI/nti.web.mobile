import StorePrototype from 'common/StorePrototype';

import {DISCUSSIONS_CHANGED, OBJECT_LOADED, OBJECT_CONTENTS_CHANGED} from './Constants';
import indexForums from './utils/index-forums';
import {decodeFromURI} from 'dataserverinterface/utils/ntiids';

var _discussions = {};
var _forums = {}; // forum objects by id.
// var _forumContents = {};
var _objectContents = {};
var _objects = {};
var _courseId;

class Store extends StorePrototype {
	constructor() {
		super();
		this.setMaxListeners(0);
		this.registerHandlers({
			
		});
	}

	setDiscussions(courseId, data) {
		_discussions[courseId] = dataOrError(data);
		_forums = Object.assign(_forums||{}, indexForums(_discussions));
		this.emitChange({
			type: DISCUSSIONS_CHANGED,
			courseId: courseId
		});
	}

	setObject(ntiid, object) {
		var key = this.__keyForObject(ntiid);
		_objects[key] = object;
		this.emitChange({
			type: OBJECT_LOADED,
			ntiid: ntiid,
			object: object
		});
	}

	setObjectContents(objectId, contents) {
		var key = this.__keyForContents(objectId);
		_objectContents[key] = contents;
		this.emitChange({
			type: OBJECT_CONTENTS_CHANGED,
			objectId: objectId,
		});
	}

	setCourseId(courseId) {
		_courseId = courseId;
	}

	getCourseId() {
		return _courseId;
	}

	getDiscussions(courseId) {
		return _discussions[courseId];
	}

	getForum(forumId) {
		return _forums[decodeFromURI(forumId)];
	}

	getObject(objectId) {
		return _objects[this.__keyForObject(objectId)];
	}

	getObjectContents(objectId) {
		var key = this.__keyForContents(objectId);
		return _objectContents[key];
	}

	__keyForContents(objectId) {
		return [decodeFromURI(objectId), 'contents'].join(':');
	}

	__keyForObject(objectId) {
		return [decodeFromURI(objectId), 'object'].join(':');
	}
}

// convenience method for creating an error object
// for failed fetch attempts
function dataOrError(data) {
	if (data && data instanceof Error) {
		return {
			error: data,
			isError: true
		};
	}
	return data;
}


export default new Store();
