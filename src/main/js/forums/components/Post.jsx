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

const objectLoadedHandler = 'Post:objectLoadedHandler';

export default React.createClass({
	displayName: '',

	mixins: [
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
			loading: true
		};
	},

	componentDidMount: function() {
		let item = Store.getObject(this.props.postId);
		if (item) {
			this.setState({
				item: item,
				loading: false
			});
		}
		else {
			this._load();
		}
	},

	_load: function() {
		let id = this._itemId();
		Api.getObject(id)
		.then(
			result => {
				Store.setObject(id, result.object);
				this.setState({
					item: result,
					loading: false
				});
			},
			reason => {
				this.setState({
					error: reason
				});
			}
		);
	},

	render () {

		if (this.state.loading) {
			return <Loading />;
		}

		let item = this._item();

		var replies = <Replies key="replies" item={item}
							childComponent={PostItem}
							topic={this.props.topic}
							display={true}
							className='visible' />;


		return (
			<div>
				<div>post</div>
				{replies}
				<CommentForm key="commentForm"
					ref='commentForm'
					onCancel={this._hideForm}
					onCompletion={this._commentCompletion}
					topic={this.props.topic}
					parent={item}
				/>
			</div>
		);
	}
});
