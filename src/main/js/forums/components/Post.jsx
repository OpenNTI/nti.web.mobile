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
import {OBJECT_DELETED, POST} from '../Constants';
import ViewHeader from './widgets/ViewHeader';
import Replies from './Replies';
import CommentForm from './CommentForm';
import Breadcrumb from 'common/components/Breadcrumb';
import NTIID from 'dataserverinterface/utils/ntiids';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import List from './List';

const objectDeletedHandler = 'Post:objectDeletedHandler';

export default React.createClass({
	displayName: '',

	mixins: [
		NavigatableMixin,
		StoreEvents,
		KeepItemInState
	],

	backingStore: Store,
	backingStoreEventHandlers: {
		[OBJECT_DELETED]: objectDeletedHandler
	},

	[objectDeletedHandler] (event) {
		if (event.objectId === this._itemId()) {
			this.setState({
				deleted: true,
				busy: false
			});
		}
	},

	_getPropId () {
		return this.props.postId;
	},

	getInitialState () {
		return {
			busy: true,
			item: null,
			deleted: false
		};
	},

	componentDidMount: function() {
		this._load();
	},

	componentWillReceiveProps: function(nextProps) {
		console.log(this.props, nextProps);
		if (this.props.postId !== nextProps.postId) {
			this.setState(this.getInitialState());
			this._load(nextProps.postId);
		}
	},

	_load: function(thePostId) {
		let postId = NTIID.decodeFromURI(thePostId || this._itemId());
		let topicId = NTIID.decodeFromURI(this.props.topicId);
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

	__getContext: function() {
		let getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		let href = this.makeHref(this.getPath());
		let itemId = this._itemId();
		let title = ViewHeader.headerTextForType(POST);
		return getContextProvider().then(context => {
			context.push({
				ntiid: itemId,
				label: title,
				href: href
			});
			return context;
		});
	},

	render () {

		if (this.state.busy) {
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

		let item = this._item();
		let topic = Store.getObject(this.props.topicId);


		let breadcrumb = <Breadcrumb contextProvider={this.__getContext}/>;

		let P = (this.state.deleted || (this._item() || {}).Deleted) ? 
			<Notice>This item has been deleted.</Notice> :
			<PostHeadline item={item} topic={topic} asHeadline={true} />;


		let replies = <Replies key="replies" item={item}
							listComponent={List}
							childComponent={PostItem}
							topic={topic}
							display={true}
							className='visible' />;

		return (
			<div>
				{breadcrumb}
				<ViewHeader type={POST} />
				{P}
				{replies}
				{topic && 
					<CommentForm key="commentForm"
						ref='commentForm'
						onCancel={this._hideForm}
						onCompletion={this._commentCompletion}
						topic={topic}
						parent={item}
					/>
				}
			</div>
		);
	}
});
