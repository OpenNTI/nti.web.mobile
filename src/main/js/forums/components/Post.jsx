import React from 'react';
import PostItem from './list-items/PostItem';
import PostHeadline from './PostHeadline';
import Loading from 'common/components/Loading';
import Notice from 'common/components/Notice';
import Err from 'common/components/Error';
import Store from '../Store';
import Api from '../Api';
import StoreEvents from 'common/mixins/StoreEvents';
import KeepItemInState from '../mixins/KeepItemInState';
import {OBJECT_DELETED, POST, COMMENT_FORM_ID} from '../Constants';
import ViewHeader from './widgets/ViewHeader';
import Replies from './Replies';
import CommentForm from './CommentForm';
import {decodeFromURI, encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import ContextSender from 'common/mixins/ContextSender';
import List from './List';

const objectDeletedHandler = 'Post:objectDeletedHandler';

export default React.createClass({
	displayName: 'Post',

	mixins: [
		NavigatableMixin,
		StoreEvents,
		KeepItemInState,
		ContextSender
	],

	backingStore: Store,
	backingStoreEventHandlers: {
		[OBJECT_DELETED]: objectDeletedHandler
	},

	[objectDeletedHandler] (event) {
		if (event.objectId === this.getItemId()) {
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
		Api.getObjects([postId, topicId])
		.then(
			result => {
				result.forEach(object => {
					Store.setObject(object.getID(), object);
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
		let inReplyTo = (this.getItem()||{}).inReplyTo;
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

		let item = this.getItem();

		if (this.state.busy || !item) {
			return <Loading />;
		}

		if (this.state.error) {
			if (this.state.error.statusCode === 404) {
				return <Notice>Not found.</Notice>;
			}
			else {
				return <Err error={this.state.error} />;
			}
		}

		let topic = Store.getObject(this.props.topicId);

		let P = (this.state.deleted || (this.getItem() || {}).Deleted) ?
			<Notice>This item has been deleted.</Notice> :
			<PostHeadline item={item} topic={topic} asHeadline={true} />;

		return (
			<div>
				<ViewHeader type={POST} />
				{P}
				<Replies key="replies" item={item}
					listComponent={List}
					childComponent={PostItem}
					topic={topic}
					display={true}
					className='visible' />
				{topic &&
					<CommentForm key="commentForm"
						ref='commentForm'
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
