import StorePrototype from 'common/StorePrototype';

import * as Constants from './Constants';
import indexForums from './utils/index-forums';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import Api from './Api';
import {defaultPagingParams} from './Api';

import hash from 'object-hash';

let discussions = {};
let forums = {}; // forum objects by id.
let objectContents = {};
let objects = {};
let courseId;

const keyForObject = 'ForumStore:keyForObject';
const keyForContents = 'ForumStore:keyForContents';

class Store extends StorePrototype {
	constructor() {
		super();
		this.setMaxListeners(0);
		this.registerHandlers({
			[Constants.GET_COMMENT_REPLIES]: function(payload) {
				getCommentReplies(payload.action.comment);
			},

			[Constants.ADD_COMMENT]: function(payload) {
				let {topic, parent, comment} = payload.action;
				addComment(topic, parent, comment);
			},

			[Constants.SAVE_COMMENT]: saveComment,
			[Constants.SAVE_TOPIC_HEADLINE]: saveComment,

			[Constants.CREATE_TOPIC]: function(payload) {
				let {forum, topic} = payload.action;
				createTopic(forum, topic);
			},

			[Constants.DELETE_TOPIC]: function(payload) {
				let {topic} = payload.action;
				deleteTopic(topic);
			},

			[Constants.DELETE_COMMENT]: function(payload) { // TODO: unify delete topic and delete comment under delete object
				let {comment} = payload.action;
				deleteComment(comment);
			},

			[Constants.REPORT_ITEM]: function(payload) {
				let {item} = payload.action;
				reportItem(item);
			}
		});
	}

	setDiscussions(theCourseId, data) {
		this.setCourseId(theCourseId);
		discussions[theCourseId] = dataOrError(data);
		forums = Object.assign(forums||{}, indexForums(discussions));
		this.emitChange({
			type: Constants.DISCUSSIONS_CHANGED,
			courseId: theCourseId
		});
	}

	setObject(ntiid, object) {
		let key = this[keyForObject](ntiid);
		objects[key] = object;
		this.emitChange({
			type: Constants.OBJECT_LOADED,
			ntiid: ntiid,
			object: object
		});
	}

	setObjectContents(objectId, contents, params={}) {
		let key = this[keyForContents](objectId, params);
		objectContents[key] = contents;
		this.emitChange({
			type: Constants.OBJECT_CONTENTS_CHANGED,
			objectId: objectId
		});
	}

	setCourseId(newCourseId) {
		courseId = newCourseId;
	}

	getCourseId() {
		return courseId;
	}

	getDiscussions(forCourseId) {
		return discussions[forCourseId];
	}

	getForum(forumId) {
		return forums[decodeFromURI(forumId)] || this.getObject(forumId);
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
		return objects[this[keyForObject](objectId)];
	}

	getObjectContents(objectId, params={}) {
		let key = this[keyForContents](objectId, params);
		return objectContents[key];
	}

	deleteObject(object) {
		let objectId = object && object.getID ? object.getID() : object;
		delete objects[this[keyForObject](objectId)];
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
 * @param {object} payload An object with these keys:
 * @param {Post} payload.postItem the post to be updated.
 * @param {object} payload.newValue properties to update and save on the item.
 * 	{
 *		title: 'new title',
 * 		body: [...] // as returned by the editor component's getValue()
 *	}
 * @return {Promise} A promise fulfilling with no value.
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
	return deleteObject(topic).then(()=>{
		console.log('Reloading forum contents in response to topic deletion.');
		getObjectContents(topic.ContainerId);
	});
}

function deleteObject(o) {
	return Api.deleteObject(o).then(()=>{
		store.deleteObject(o);
	});
}

function deleteComment(comment) {
	return deleteObject(comment);
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
