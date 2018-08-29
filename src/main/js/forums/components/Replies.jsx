import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {StoreEventsMixin} from '@nti/lib-store';

import * as Actions from '../Actions';
import Store from '../Store';
import {
	GOT_COMMENT_REPLIES,
	COMMENT_ADDED,
	ITEM_DELETED
} from '../Constants';



export default createReactClass({
	displayName: 'forums:Replies',

	mixins: [StoreEventsMixin],

	propTypes: {
		className: PropTypes.string,
		display: PropTypes.bool,

		item: PropTypes.object.isRequired,
		topic: PropTypes.object.isRequired,
		listComponent: PropTypes.func.isRequired // passed in as a prop to dodge circular import of List
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[GOT_COMMENT_REPLIES]: 'onReceivedCommentReplies',
		[COMMENT_ADDED]: 'onCommentAdded',
		[ITEM_DELETED]: 'onDeleted'
	},

	onReceivedCommentReplies (event) {
		let {item} = this.props;
		if(event.comment === item) {
			let itemId = item.getID();
			this.setState({
				replies: (event.replies || []).filter(x => (x.inReplyTo === itemId))
			});
		}
	},

	onCommentAdded (event) {
		let {item} = this.props;
		let {parent, result} = event.data;
		if (parent === item || result.inReplyTo === item.getID()) {
			this.getReplies(true);
		}
	},

	onDeleted (event) {
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

	componentDidUpdate (prevProps) {
		if (this.props.item !== prevProps.item) {
			this.getReplies();
		}
	},

	getReplies (/*reload*/) {
		let {item} = this.props;
		// if (!item || (item.ReferencedByCount === 0 && !reload)) {
		if (!item) {
			// console.debug('not reloading replies.');
			return;
		}
		Actions.getCommentReplies(item);
	},

	renderReplies () {
		const {props: {display, listComponent: List, ...props}, state: {replies}} = this;

		if (!display) {
			return;
		}

		delete props.item;

		const items = replies || [];

		return items.length > 0 ? <List container={{Items: items}} {...props} /> : null;
	},

	render () {
		const {className} = this.props;
		return (
			<div className={className}>
				<div className="replies">
					{this.renderReplies()}
				</div>
			</div>
		);
	}

});
