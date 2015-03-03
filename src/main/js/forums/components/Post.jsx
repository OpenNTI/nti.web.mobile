import React from 'react';
import PostItem from './list-items/PostItem';
import Loading from 'common/components/Loading';
import Store from '../Store';
import Api from '../Api';
import StoreEvents from 'common/mixins/StoreEvents';
import KeepItemInState from '../mixins/KeepItemInState';
import {OBJECT_LOADED} from '../Constants';
import Replies from './Replies';
import CommentForm from './CommentForm';
import Breadcrumb from 'common/components/Breadcrumb';
import NTIID from 'dataserverinterface/utils/ntiids';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

const objectLoadedHandler = 'Post:objectLoadedHandler';

export default React.createClass({
	displayName: '',

	mixins: [
		NavigatableMixin,
		StoreEvents,
		KeepItemInState
	],

	backingStore: Store,
	backingStoreEventHandlers: {
		[OBJECT_LOADED]: objectLoadedHandler
	},

	[objectLoadedHandler] (event) {
		console.log(event);
	},

	_getPropId () {
		return this.props.postId;
	},

	getInitialState () {
		return {
			busy: true
		};
	},

	componentDidMount: function() {
		let item = Store.getObject(this._itemId());
		let topic = Store.getObject(this.props.topicId);
		if (item && topic) {
			this.setState({
				item: item,
				topic: topic,
				busy: false
			});
		}
		else {
			this._load();
		}
	},

	componentWillReceiveProps: function(nextProps) {
		console.log(this.props, nextProps);
		if (this.props.postId !== nextProps.postId) {
			this.setState({
				busy: true,
				item: null
			});
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
					error: reason
				});
			}
		);
	},

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		var href = this.makeHref(this.getPath());
		var itemId = this._itemId();
		var title = 'Post';
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

		let item = this._item();
		let topic = Store.getObject(this.props.topicId);

		var breadcrumb = <Breadcrumb contextProvider={this.__getContext}/>;
		var replies = <Replies key="replies" item={item}
							childComponent={PostItem}
							topic={topic}
							display={true}
							className='visible' />;


		return (
			<div>
				{breadcrumb}
				<PostItem item={item} topic={topic} />
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
