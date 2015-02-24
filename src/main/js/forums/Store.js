import StorePrototype from 'common/StorePrototype';

import {DISCUSSIONS_CHANGED} from './Constants';
import indexForums from './utils/index-forums';

var _discussions = {};
var _forums = {}; // forum objects by id.
// var _forumContents = {};
// var _objectContents = {};
// var _objects = {};
var _courseId;

class Store extends StorePrototype {
	constructor() {
		super();
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

	setCourseId(courseId) {
		_courseId = courseId;
	}

	getCourseId() {
		return _courseId;
	}

	getDiscussions(courseId) {
		return _discussions[courseId];
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
