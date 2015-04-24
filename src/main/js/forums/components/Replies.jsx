import React from 'react';

import StoreEvents from 'common/mixins/StoreEvents';

import * as Actions from '../Actions';
import Store from '../Store';
import {
	GOT_COMMENT_REPLIES,
	COMMENT_ADDED,
	OBJECT_DELETED
} from '../Constants';


const gotCommentRepliesHandler = 'Replies:gotCommentRepliesHandler';
const commentAddedHandler = 'Replies:commentAddedHandler';
const objectDeletedHandler = 'Replies:objectDeletedHandler';

export default React.createClass({
	displayName: 'Replies',

	mixins: [StoreEvents],

	propTypes: {
		className: React.PropTypes.string,
		display: React.PropTypes.bool,

		item: React.PropTypes.object.isRequired,
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
				replies: (event.replies || []).filter(x => (x.inReplyTo === itemId))
			});
		}
	},

	[commentAddedHandler] (event) {
		let {item} = this.props;
		let {parent, result} = event.data;
		if (parent === item || result.inReplyTo === item.getID()) {
			this.getReplies(true);
		}
	},

	[objectDeletedHandler] (event) {
		let {item} = this.props;
		let eventItem = event.object || event.item;
		let parent = eventItem && eventItem.parent();
		// if the deleted item is a reply to our item, reload our children.
		if (parent && parent.getID && parent.getID() === item.getID()) {
			this.getReplies(true);
		}
	},


	getInitialState () {
		return {
			replies: null,
			display: false,
			showForm: false
		};
	},

	componentDidMount () {
		this.getReplies();
	},

	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.getReplies();
		}
	},

	getReplies (/*reload*/) {
		let {item} = this.props;
		// if (!item || (item.ReferencedByCount === 0 && !reload)) {
		if (!item) {
			console.debug('not reloading replies.');
			return;
		}
		Actions.getCommentReplies(item);
	},

	renderReplies () {
		if (!this.props.display) {
			return;
		}
		let items = this.state.replies || [];
		let List = this.props.listComponent;
		return items.length > 0 ? <List container={{Items: items}} {...this.props} /> : null;
	},

	render () {
		return (
			<div className={this.props.className}>
				<div className="replies">
					{this.renderReplies()}
				</div>
			</div>
		);
	}

});
