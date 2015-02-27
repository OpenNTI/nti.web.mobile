import AppDispatcher from 'dispatcher/AppDispatcher';
import TypedEventEmitter from 'common/TypedEventEmitter';

import Constants from './Constants';
import Api from './Api';

import {decodeFromURI} from 'dataserverinterface/utils/ntiids';
import indexForums from './utils/index-forums';

var _discussions = {};
var _forums = {}; // forum objects by id.
var _forumContents = {};
var _objectContents = {};
var _objects = {};
var _courseId;

class ForumStore extends TypedEventEmitter {

	constructor() {
		super();
		this.setMaxListeners(0);
	}

	setDiscussions(courseId, data) {
		_discussions[courseId] = dataOrError(data);
		_forums = Object.assign(_forums||{}, indexForums(_discussions));
		this.emitChange({
			type: Constants.DISCUSSIONS_CHANGED,
			courseId: courseId
		});
	}

	getDiscussions(courseId) {
		return _discussions[courseId];
	}

	getForum(forumId) {
		return _forums[decodeFromURI(forumId)];
	}

	setBoardContents(courseId, boardId, data) {
		_forumContents[boardId] = dataOrError(data);
		this.emitChange({
			type: Constants.BOARD_CONTENTS_CHANGED,
			forumId: boardId
		});
	}

	setCourseId(courseId) {
		_courseId = courseId;
	}

	getCourseId() {
		return _courseId;
	}

	getForumContents(forumId) {
		return _forumContents[forumId];
	}

	getObjectContents(objectId) {
		var key = this.__keyForContents(objectId);
		return _objectContents[key];
	}

	getObject(objectId) {
		return _objects[this.__keyForObject(objectId)];
	}

	setObject(ntiid, object) {
		var key = this.__keyForObject(ntiid);
		_objects[key] = object;
		this.emitChange({
			type: Constants.OBJECT_LOADED,
			ntiid: ntiid,
			object: object
		});
	}

	deleteObject(object) {
		var objectId = object && object.getID ? object.getID() : object;
		delete _objects[this.__keyForObject(objectId)];
		this.emitChange({
			type: Constants.OBJECT_DELETED,
			objectId: objectId,
			object: object
		});
	}

	setObjectContents(objectId, contents) {
		var key = this.__keyForContents(objectId);
		_objectContents[key] = contents;
		this.emitChange({
			type: Constants.OBJECT_CONTENTS_CHANGED,
			objectId: objectId,
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

	__keyForContents(objectId) {
		return [decodeFromURI(objectId), 'contents'].join(':');
	}

	__keyForObject(objectId) {
		return [decodeFromURI(objectId), 'object'].join(':');
	}

}

let Store = new ForumStore();

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

function getCommentReplies(comment) {
	if(!comment || !comment.getReplies) {
		console.warn('Can\'t get replies from %O', comment);
		return;
	}
	comment.getReplies().then(replies => {
		Store.emitChange({
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
			Store.commentAdded({
				topic: topic,
				parent: parent,
				result: result
			});
		},
		reason => {
			console.error(reason);
			Store.commentError({
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
function saveComment(item, newProperties) {
	return item.setProperties(newProperties)
	.then(result => {
		Store.commentSaved(result);
	});
}

function createTopic(forum, topic) {
	return forum.createTopic(topic)
	.then(
		result => {
			Store.emitChange({
				type: Constants.TOPIC_CREATED,
				topic: result,
				forum: forum
			});
			getObjectContents(forum.getID());
		},
		reason => {
			Store.topicCreationError({
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
		Store.deleteObject(o);
	});
}

function deleteComment(comment) {
	return _deleteObject(comment);
}

function getObjectContents(ntiid, params) {
	return getObject(ntiid).then(object => {
		return object.getContents(params).then(contents => {
			Store.setObjectContents(ntiid, contents);
		});
	});
}

function getObject(ntiid) {
	return Api.getObject(ntiid).then(
		object => {
			Store.setObject(ntiid, object);
			return object;
		});
}

function reportItem(item) {
	return Api.reportItem(item)
	.then((result) => {
		Store.setObject(result.getID(), result);
		Store.emitChange({
			type: Constants.ITEM_REPORTED,
			item: item
		});
	});
}



Store.appDispatch = AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case Constants.GET_COMMENT_REPLIES:
			getCommentReplies(action.comment);
			break;
		case Constants.ADD_COMMENT:
			var {topic, parent, comment} = action;
			addComment(topic, parent, comment);
			break;
		case Constants.SAVE_COMMENT:
		case Constants.SAVE_TOPIC_HEADLINE:
			var {postItem, newValue} = action;
			saveComment(postItem, newValue);
			break;
		case Constants.CREATE_TOPIC:
			var {forum, topic} = action;
			createTopic(forum, topic);
			break;
		case Constants.DELETE_TOPIC:
			var {topic} = action;
			deleteTopic(topic);
			break;
		case Constants.DELETE_COMMENT: // TODO: unify delete topic and delete comment under delete object
			var {comment} = action;
			deleteComment(comment);
			break;
		case Constants.REPORT_ITEM:
			var {item} = action;
			reportItem(item);
			break;
		default:
			return true;
	}
	return true;
});


export default Store;
