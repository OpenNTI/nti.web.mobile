import Logger from 'nti-util-logger';
import {decodeFromURI} from 'nti-lib-ntiids';
import StorePrototype from 'nti-lib-store';
import hash from 'object-hash';

import * as Constants from './Constants';
import indexForums from './utils/index-forums';
import {getForumItem, DEFAULT_PAGING_PARAMS} from './Api';


const logger = Logger.get('forums:store');

const keyForItem = 'ForumStore:keyForItem';
const keyForContents = 'ForumStore:keyForContents';

class Store extends StorePrototype {
	constructor () {
		super();
		this.setMaxListeners(100);

		Object.assign(this, {
			discussions: {},
			forums: {},// forum items by id.
			itemContents: {},
			items: {},
			contextID: undefined
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

			[Constants.CREATE_TOPIC] (payload) {
				let {forum, topic} = payload.action;
				createTopic(forum, topic);
			},

			[Constants.DELETE_TOPIC] (payload) {
				let {topic} = payload.action;
				deleteTopic(topic);
			},

			[Constants.DELETE_COMMENT] (payload) { // TODO: unify delete topic and delete comment under delete item
				let {comment} = payload.action;
				deleteComment(comment);
			},

			[Constants.REPORT_ITEM] (payload) {
				let {item} = payload.action;
				reportItem(item);
			}
		});
	}

	setDiscussions (contextID, data) {
		this.setContextID(contextID);
		this.discussions[contextID] = dataOrError(data);
		this.forums = Object.assign(this.forums || {}, indexForums(this.discussions));
		this.emitChange({ type: Constants.DISCUSSIONS_CHANGED, contextID });
	}

	setForumItem (ntiid, item) {
		let key = this[keyForItem](ntiid);
		this.items[key] = item;
		this.emitChange({ type: Constants.ITEM_LOADED, ntiid, item });
	}

	setForumItemContents (itemId, contents, params = {}) {
		let key = this[keyForContents](itemId, params);
		this.itemContents[key] = contents;
		this.emitChange({ type: Constants.ITEM_CONTENTS_CHANGED, itemId });
	}


	// Allows the Actions component to enable/disable the edit link,
	// preventing multiple editors from being opened simultaneously.
	startEdit () {
		this.emitChange({ type: Constants.EDIT_STARTED });
	}

	endEdit () {
		this.emitChange({ type: Constants.EDIT_ENDED });
	}

	setContextID (contextID) {
		this.contextID = contextID;
	}

	getContextID () {
		return this.contextID;
	}

	getDiscussions (forPackageId) {
		return this.discussions[forPackageId];
	}

	getForum (forumId) {
		return this.forums[decodeFromURI(forumId)] || this.getForumItem(forumId);
	}

	getForumContents (forumId, batchStart, batchSize) {
		return this.getForumItemContents(
			forumId,
			Object.assign(
				{},
				DEFAULT_PAGING_PARAMS,
				{batchStart, batchSize}
			)
		);
	}

	getForumItem (itemId) {
		return this.items[this[keyForItem](itemId)];
	}

	getForumItemContents (itemId, params = {}) {
		let key = this[keyForContents](itemId, params);
		return this.itemContents[key];
	}

	deleteForumItem (item) {
		let itemId = item && item.getID ? item.getID() : item;
		delete this.items[this[keyForItem](itemId)];
		this.emitChange({ type: Constants.ITEM_DELETED, itemId, item });
	}

	commentAdded (data) {
		this.emitChange({ type: Constants.COMMENT_ADDED, data });
	}

	commentSaved (data) {
		this.setForumItem(data.getID(), data);
		this.emitChange({ type: Constants.COMMENT_SAVED, data });
	}

	commentError (data) {
		this.emitError({ type: Constants.COMMENT_ERROR, data });
	}

	topicCreationError (data) {
		this.emitError({ type: Constants.TOPIC_CREATION_ERROR, data });
	}

	[keyForContents] (itemId, params = {}) {
		return [decodeFromURI(itemId), hash(params), 'contents'].join(':');
	}

	[keyForItem] (itemId) {
		return [decodeFromURI(itemId), 'item'].join(':');
	}
}

// convenience method for creating an error for failed fetch attempts
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
		logger.warn('Can\'t get replies from %O', comment);
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
				logger.error(reason);
				store.commentError({
					topic: topic,
					parent: parent,
					reason: reason
				});
			}
		);
}

/**
 * @param {object} payload An item with these keys:
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
				getForumItemContents(forum.getID());
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
	return deleteForumItem(topic).then(() => {
		logger.log('Reloading forum contents in response to topic deletion.');
		getForumItemContents(topic.ContainerId);
	});
}

function deleteForumItem (o) {
	return o.delete().then(() =>
		store.deleteForumItem(o));
}

function deleteComment (comment) {
	return deleteForumItem(comment);
}

function getForumItemContents (ntiid, params) {
	return getForumItem(ntiid)
		.then(item => {
			store.setForumItem(ntiid, item);
			return item;
		})
		.then(item => item.getContents(params))
		.then(contents =>
			store.setForumItemContents(ntiid, contents));
}


function reportItem (item) {
	return item.flag().then(() => {
		store.setForumItem(item.getID(), item);
		store.emitChange({
			type: Constants.ITEM_REPORTED,
			item: item
		});
	});
}

export default store;
