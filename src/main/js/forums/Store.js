import StorePrototype from 'common/StorePrototype';

import * as Constants from './Constants';
import indexForums from './utils/index-forums';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import Api from './Api';
import {defaultPagingParams} from './Api';
import hash from 'object-hash';

let _discussions = {};
let _forums = {}; // forum objects by id.
let _objectContents = {};
let _objects = {};
let _courseId;

const keyForObject = "ForumStore:keyForObject";
const keyForContents = "ForumStore:keyForContents";

class Store extends StorePrototype {
	constructor() {
		super();
		this.setMaxListeners(0);
		this.registerHandlers({
			[Constants.GET_COMMENT_REPLIES]: function(payload) {
				getCommentReplies(payload.action.comment);
			},

			[Constants.ADD_COMMENT]: function(payload) {
				var {topic, parent, comment} = payload.action;
				addComment(topic, parent, comment);
			},

			[Constants.SAVE_COMMENT]: saveComment,
			[Constants.SAVE_TOPIC_HEADLINE]: saveComment,

			[Constants.CREATE_TOPIC]: function(payload) {
				var {forum, topic} = payload.action;
				createTopic(forum, topic);
			},

			[Constants.DELETE_TOPIC]: function(payload) {
				var {topic} = payload.action;
				deleteTopic(topic);
			},

			[Constants.DELETE_COMMENT]: function(payload) { // TODO: unify delete topic and delete comment under delete object
				var {comment} = payload.action;
				deleteComment(comment);
			},

			[Constants.REPORT_ITEM]: function(payload) {
				var {item} = payload.action;
				reportItem(item);
			}
		});
	}

	setDiscussions(courseId, data) {
		this.setCourseId(courseId);
		_discussions[courseId] = dataOrError(data);
		_forums = Object.assign(_forums||{}, indexForums(_discussions));
		this.emitChange({
			type: Constants.DISCUSSIONS_CHANGED,
			courseId: courseId
		});
	}

	setObject(ntiid, object) {
		let key = this[keyForObject](ntiid);
		_objects[key] = object;
		this.emitChange({
			type: Constants.OBJECT_LOADED,
			ntiid: ntiid,
			object: object
		});
	}

	setObjectContents(objectId, contents, params={}) {
		let key = this[keyForContents](objectId, params);
		_objectContents[key] = contents;
		this.emitChange({
			type: Constants.OBJECT_CONTENTS_CHANGED,
			objectId: objectId
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
		return _forums[decodeFromURI(forumId)] || this.getObject(forumId);
	}

	getForumContents(forumId, batchStart, batchSize) {
		return this.getObjectContents(
			forumId,
			Object.assign(
				{},
				defaultPagingParams,
				{batchStart, batchSize}
			)
		);
	}

	getObject(objectId) {
		return _objects[this[keyForObject](objectId)];
	}

	getObjectContents(objectId, params={}) {
		let key = this[keyForContents](objectId, params);
		return _objectContents[key];
	}

	deleteObject(object) {
		let objectId = object && object.getID ? object.getID() : object;
		delete _objects[this[keyForObject](objectId)];
		this.emitChange({
			type: Constants.OBJECT_DELETED,
			objectId: objectId,
			object: object
		});
	}

	commentAdded (data) {
		this.emitChange({
			type: Constants.COMMENT_ADDED,
			data: data
		});
	}

	commentSaved (result) {
		this.setObject(result.getID(), result);
		this.emitChange({
			type: Constants.COMMENT_SAVED,
			data: result
		});
	}

	commentError (data) {
		this.emitError({
			type: Constants.COMMENT_ERROR,
			data: data
		});
	}

	topicCreationError (data) {
		this.emitError({
			type: Constants.TOPIC_CREATION_ERROR,
			data: data
		});
	}

	[keyForContents](objectId, params={}) {
		return [decodeFromURI(objectId), hash(params), 'contents'].join(':');
	}

	[keyForObject](objectId) {
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

const store = new Store();

function getCommentReplies(comment) {
	if(!comment || !comment.getReplies) {
		console.warn('Can\'t get replies from %O', comment);
		return;
	}
	comment.getReplies().then(replies => {
		store.emitChange({
			type: Constants.GOT_COMMENT_REPLIES,
			comment: comment,
			replies: replies
		});
	});
}

function addComment(topic, parent, comment) {
	return topic.addComment(comment, parent)
	.then(
		result => {
			// getObjectContents()
			store.commentAdded({
				topic: topic,
				parent: parent,
				result: result
			});
		},
		reason => {
			console.error(reason);
			store.commentError({
				topic: topic,
				parent: parent,
				reason: reason
			});
		}
	);
}

/**
* @param item {Post} the post to be updated.
* @param newProperties {object} properties to update and save on the item.
* 	{
*		title: 'new title',
* 		body: [...] // as returned by the editor component's getValue()
*	}
*/
function saveComment(payload) {
	let {postItem, newValue} = payload.action;
	return postItem.setProperties(newValue)
	.then(result => {
		store.commentSaved(result);
	});
}

function createTopic(forum, topic) {
	return forum.createTopic(topic)
	.then(
		result => {
			store.emitChange({
				type: Constants.TOPIC_CREATED,
				topic: result,
				forum: forum
			});
			getObjectContents(forum.getID());
		},
		reason => {
			store.topicCreationError({
				forum: forum,
				topic: topic,
				reason: reason
			});
		}
	);
}

function deleteTopic(topic) {
	return _deleteObject(topic).then(()=>{
		console.log('Reloading forum contents in response to topic deletion.');
		getObjectContents(topic.ContainerId);
	});
}

function _deleteObject(o) {
	return Api.deleteObject(o).then(()=>{
		store.deleteObject(o);
	});
}

function deleteComment(comment) {
	return _deleteObject(comment);
}

function getObjectContents(ntiid, params) {
	return getObject(ntiid).then(object => {
		return object.getContents(params).then(contents => {
			store.setObjectContents(ntiid, contents);
		});
	});
}

function getObject(ntiid) {
	return Api.getObject(ntiid).then(
		object => {
			store.setObject(ntiid, object);
			return object;
		});
}

function reportItem(item) {
	return Api.reportItem(item)
	.then((result) => {
		store.setObject(result.getID(), result);
		store.emitChange({
			type: Constants.ITEM_REPORTED,
			item: item
		});
	});
}

export default store;
