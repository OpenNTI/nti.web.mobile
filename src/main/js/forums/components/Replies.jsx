'use strict';

import React from 'react';
import Actions from '../Actions';
import {GOT_COMMENT_REPLIES, COMMENT_ADDED, OBJECT_DELETED} from '../Constants';
import Store from '../Store';
import StoreEvents from 'common/mixins/StoreEvents';
const gotCommentRepliesHandler = 'Replies:gotCommentRepliesHandler';
const commentAddedHandler = 'Replies:commentAddedHandler';
const objectDeletedHandler = 'Replies:objectDeletedHandler';

let Replies = React.createClass({

	mixins: [StoreEvents],

	propTypes: {
		topic: React.PropTypes.object.isRequired,
		listComponent: React.PropTypes.func.isRequired // passed in as a prop to dodge circular import of List
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[GOT_COMMENT_REPLIES]: gotCommentRepliesHandler,
		[COMMENT_ADDED]: commentAddedHandler,
		[OBJECT_DELETED]: objectDeletedHandler
	},

	[gotCommentRepliesHandler] (event) {
		let {item} = this.props;
		if(event.comment === item) {
			let itemId = item.getID();
			this.setState({
				replies: (event.replies||[]).filter(item => (item.inReplyTo === itemId))
			});
		}
	},

	[commentAddedHandler] (event) {
		let {item} = this.props;
		let {parent, result} = event.data;
		if (parent === item || result.inReplyTo === item.getID()) {
			this._getReplies(true);
		}
	},

	[objectDeletedHandler] (event) {
		let {item} = this.props;
		let eventItem = event.object || event.item;
		let parent = eventItem && eventItem.parent();
		// if the deleted item is a reply to our item, reload our children.
		if (parent && parent.getID && parent.getID() === item.getID()) {
			this._getReplies(true);
		}
	},

	
	getInitialState: function() {
		return {
			replies: null,
			display: false,
			showForm: false
		};
	},

	componentDidMount: function() {
		this._getReplies();
	},

	_getReplies: function(reload) {
		let {item} = this.props;
		if (!item || (item.ReferencedByCount === 0 && !reload)) {
			return;
		}
		Actions.getCommentReplies(item);
	},

	_renderReplies: function() {
		if (!this.props.display) {
			return;
		}
		let items = this.state.replies||[];
		let List = this.props.listComponent;
		return items.length > 0 ? <List container={{Items: items}} {...this.props} /> : null;
	},

	render: function() {
		return (
			<div className={this.props.className}>
				<div className="replies">
					{this._renderReplies()}					
				</div>
			</div>
		);
	}

});

module.exports = Replies;
