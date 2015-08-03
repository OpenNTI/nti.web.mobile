import StorePrototype from 'common/StorePrototype';

import * as Constants from './Constants';
import indexForums from './utils/index-forums';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import {getObject, DEFAULT_PAGING_PARAMS} from './Api';

import hash from 'object-hash';

const keyForObject = 'ForumStore:keyForObject';
const keyForContents = 'ForumStore:keyForContents';

class Store extends StorePrototype {
	constructor () {
		super();
		this.setMaxListeners(0);

		Object.assign(this, {
			discussions: {},
			forums: {},// forum objects by id.
			objectContents: {},
			objects: {},
			packageId: undefined
		});

		//FIXME: Stores respond to Action's results and store. period.
		// Actions should not be hollow shells that dispatch commands.
		// Actions should do the heavy lifting and calling the Api,
		// and dispatching finalized data for the store to apply
		// synchronously.
		//
		// No method, nor function within the entire FILE of a Store
		//  should have any "Action"-like behavior. Nor should there
		//  ever be Action/Api imports in a Store.
		//  The Store is the File. Not the Export.
		this.registerHandlers({
			[Constants.GET_COMMENT_REPLIES] (payload) {
				getCommentReplies(payload.action.comment);
			},

			[Constants.ADD_COMMENT] (payload) {
				let {topic, parent, comment} = payload.action;
				addComment(topic, parent, comment);
			},

			[Constants.SAVE_COMMENT]: saveComment,
			[Constants.SAVE_TOPIC_HEADLINE]: saveComment,

			[Constants.CREATE_TOPIC] (payload) {
				let {forum, topic} = payload.action;
				createTopic(forum, topic);
			},

			[Constants.DELETE_TOPIC] (payload) {
				let {topic} = payload.action;
				deleteTopic(topic);
			},

			[Constants.DELETE_COMMENT] (payload) { // TODO: unify delete topic and delete comment under delete object
				let {comment} = payload.action;
				deleteComment(comment);
			},

			[Constants.REPORT_ITEM] (payload) {
				let {item} = payload.action;
				reportItem(item);
			}
		});
	}

	setDiscussions (packageId, data) {
		this.setPackageId(packageId);
		this.discussions[packageId] = dataOrError(data);
		this.forums = Object.assign(this.forums || {}, indexForums(this.discussions));
		this.emitChange({ type: Constants.DISCUSSIONS_CHANGED, packageId });
	}

	setObject (ntiid, object) {
		let key = this[keyForObject](ntiid);
		this.objects[key] = object;
		this.emitChange({ type: Constants.OBJECT_LOADED, ntiid, object });
	}

	setObjectContents (objectId, contents, params={}) {
		let key = this[keyForContents](objectId, params);
		this.objectContents[key] = contents;
		this.emitChange({ type: Constants.OBJECT_CONTENTS_CHANGED, objectId });
	}

	setPackageId (packageId) {
		this.packageId = packageId;
	}

	getPackageId () {
		return this.packageId;
	}

	getDiscussions (forPackageId) {
		return this.discussions[forPackageId];
	}

	getForum (forumId) {
		return this.forums[decodeFromURI(forumId)] || this.getObject(forumId);
	}

	getForumContents (forumId, batchStart, batchSize) {
		return this.getObjectContents(
			forumId,
			Object.assign(
				{},
				DEFAULT_PAGING_PARAMS,
				{batchStart, batchSize}
			)
		);
	}

	getObject (objectId) {
		return this.objects[this[keyForObject](objectId)];
	}

	getObjectContents (objectId, params={}) {
		let key = this[keyForContents](objectId, params);
		return this.objectContents[key];
	}

	deleteObject (object) {
		let objectId = object && object.getID ? object.getID() : object;
		delete this.objects[this[keyForObject](objectId)];
		this.emitChange({ type: Constants.OBJECT_DELETED, objectId, object });
	}

	commentAdded (data) {
		this.emitChange({ type: Constants.COMMENT_ADDED, data });
	}

	commentSaved (data) {
		this.setObject(data.getID(), data);
		this.emitChange({ type: Constants.COMMENT_SAVED, data });
	}

	commentError (data) {
		this.emitError({ type: Constants.COMMENT_ERROR, data });
	}

	topicCreationError (data) {
		this.emitError({ type: Constants.TOPIC_CREATION_ERROR, data });
	}

	[keyForContents] (objectId, params={}) {
		return [decodeFromURI(objectId), hash(params), 'contents'].join(':');
	}

	[keyForObject] (objectId) {
		return [decodeFromURI(objectId), 'object'].join(':');
	}
}

// convenience method for creating an error object
// for failed fetch attempts
function dataOrError (data) {
	if (data && data instanceof Error) {
		return {
			error: data,
			isError: true
		};
	}
	return data;
}

const store = new Store();

function getCommentReplies (comment) {
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

function addComment (topic, parent, comment) {
	return topic.addComment(comment, parent)
		.then(
			result => {
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
function saveComment (payload) {
	let {postItem, newValue} = payload.action;
	return postItem.save(newValue)
		.then(() =>
			store.commentSaved(postItem));
}

function createTopic (forum, topic) {
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

function deleteTopic (topic) {
	return deleteObject(topic).then(() => {
		console.log('Reloading forum contents in response to topic deletion.');
		getObjectContents(topic.ContainerId);
	});
}

function deleteObject (o) {
	return o.delete().then(() =>
		store.deleteObject(o));
}

function deleteComment (comment) {
	return deleteObject(comment);
}

function getObjectContents (ntiid, params) {
	return getObject(ntiid)
		.then(object => {
			store.setObject(ntiid, object);
			return object;
		})
		.then(object => object.getContents(params))
		.then(contents =>
			store.setObjectContents(ntiid, contents));
}


function reportItem (item) {
	return item.flag().then((result) => {
		store.setObject(result.getID(), result);
		store.emitChange({
			type: Constants.ITEM_REPORTED,
			item: item
		});
	});
}

export default store;
