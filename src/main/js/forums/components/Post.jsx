import React from 'react';

import {decodeFromURI, encodeForURI} from 'nti-lib-ntiids';

import {Loading} from 'nti-web-commons';
import {Notice} from 'nti-web-commons';
import {Error as Err} from 'nti-web-commons';

import {Mixins} from 'nti-web-commons';
import ContextSender from 'common/mixins/ContextSender';
import {StoreEventsMixin} from 'nti-lib-store';

import KeepItemInState from '../mixins/KeepItemInState';

import PostItem from './list-items/PostItem';
import PostHeadline from './PostHeadline';
import ViewHeader from './widgets/ViewHeader';

import Replies from './Replies';
import CommentForm from './CommentForm';
import List from './List';

import {ITEM_DELETED, POST, COMMENT_FORM_ID} from '../Constants';
import Store from '../Store';
import {getForumItems} from '../Api';


export default React.createClass({
	displayName: 'forums:Post',

	mixins: [
		Mixins.NavigatableMixin,
		StoreEventsMixin,
		KeepItemInState,
		ContextSender
	],

	propTypes: {
		postId: React.PropTypes.string,
		topicId: React.PropTypes.string
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[ITEM_DELETED]: 'onDeleted'
	},

	onDeleted (event) {
		if (event.itemId === this.getItemId()) {
			this.setState({
				deleted: true,
				busy: false
			});
		}
	},

	getPropId () {
		return this.props.postId;
	},

	getInitialState () {
		return {
			busy: true,
			item: null,
			deleted: false
		};
	},

	componentDidMount () {
		this.doLoad();
	},

	componentWillReceiveProps (nextProps) {
		if (this.props.postId !== nextProps.postId) {
			this.setState(this.getInitialState());
			this.doLoad(nextProps.postId);
		}
	},

	doLoad (thePostId) {
		let postId = decodeFromURI(thePostId || this.getItemId());
		let topicId = decodeFromURI(this.props.topicId);
		getForumItems([postId, topicId]).then(
			result => {
				result.forEach(item => {
					Store.setForumItem(item.getID(), item);
				});
				this.setState({
					item: result[0],
					busy: false
				});
			},
			reason => {
				this.setState({
					busy: false,
					error: reason
				});
			}
		);
	},

	// title bar back arrow
	getContext () {
		let result = [];
		let label = ViewHeader.headerTextForType(POST);
		// if this is a reply to a comment (as opposed to a reply to a topic)
		// push an item for the parent comment.
		let inReplyTo = (this.getItem() || {}).inReplyTo;
		if (inReplyTo) {
			result.push({
				label,
				href: this.getNavigable().makeHref(encodeForURI(inReplyTo) + '/')
			});
		}

		// entry for this post
		result.push({
			label,
			href: this.getNavigable().makeHref(this.getPath())
		});

		return Promise.resolve(result);

	},

	render () {

		let {busy, deleted, error} = this.state;

		let item = this.getItem();

		if (error) {
			if (error.statusCode === 404) {
				return <Notice>Not found.</Notice>;
			}
			else {
				return <Err error={error} />;
			}
		}

		if (busy || !item) {
			return <Loading />;
		}

		let topic = Store.getForumItem(this.props.topicId);

		return (
			<div>
				<ViewHeader type={POST} />
				{(deleted || (this.getItem() || {}).Deleted) ? (
					<Notice>This item has been deleted.</Notice>
				) : (
					<PostHeadline item={item} topic={topic} asHeadline />
				)}
				{topic &&
					<Replies key="replies" item={item}
						listComponent={List}
						childComponent={PostItem}
						topic={topic}
						display
						className="visible"
						/>
				}
				{topic &&
					<CommentForm key="commentForm"
						id={COMMENT_FORM_ID}
						onCancel={this.hideForm}
						onCompletion={this.commentCompletion}
						topic={topic}
						parent={item}
						/>
				}
			</div>
		);
	}
});
