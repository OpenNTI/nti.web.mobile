'use strict';
/** @module forums/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');
var Api = require('./Api');
var Store = require('./Store');


module.exports = {
	getCommentReplies: function(comment) {
		dispatch(Constants.GET_COMMENT_REPLIES, {
			comment: comment
		});
	},

	addComment: function(topic, parent, comment) {
		var add = Api.addComment(topic, parent, comment);
		add.then(result => {
			Store.commentAdded(result);
		});
	}
};

function dispatch(key, data) {
	AppDispatcher.handleRequestAction(Object.assign( data, {
		type: key
	}));
}
