import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {encodeForURI, isNTIID} from 'nti-lib-ntiids';
import Router, {Location} from 'react-router-component';
import {Error as Err, Loading, Mixins} from 'nti-web-commons';
import {StoreEventsMixin} from 'nti-lib-store';

import ContextSender from 'common/mixins/ContextSender';

import KeepItemInState from '../mixins/KeepItemInState';
import ToggleState from '../mixins/ToggleState';
import Paging from '../mixins/Paging';
import Store from '../Store';
import {ITEM_CONTENTS_CHANGED} from '../Constants';

import Topic from './Topic';
import Post from './Post';



export default createReactClass({
	displayName: 'TopicView',

	mixins: [
		StoreEventsMixin,
		Mixins.NavigatableMixin,
		KeepItemInState,
		ToggleState,
		ContextSender,
		Paging
	],

	propTypes: {
		topicId: PropTypes.string
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[ITEM_CONTENTS_CHANGED] (event) {
			if (event.itemId === this.props.topicId) {
				this.setState({
					loading: false
				});
			}
		}
	},

	getInitialState () {
		return {
			// loading: true,
			deleted: false
		};
	},

	// title bar back arrow
	getContext () {
		let topic = this.getTopic();
		let {topicId} = this.props;
		let href = this.makeHref('/' + (isNTIID(topicId) ? encodeForURI(topicId) : topicId) + '/');
		let label = topic && topic.headline ? topic.headline.title : 'Topic';

		return Promise.resolve({
			label,
			href
		});

	},

	getTopic () {
		return this.getItem() || Store.getForumItem(this.props.topicId);
	},

	render () {

		if (this.state.error) {
			return <Err error={this.state.error} />;
		}

		if (this.state.loading) {
			return <Loading.Mask />;
		}

		let topic = this.getTopic();

		let currentPage = this.currentPage();

		return (
			<Router.Locations contextual>
				<Location path="/"
					handler={Topic}
					topic={topic}
					page={currentPage}
					{...this.props}
				/>
				<Location path="/:postId/"
					handler={Post}
					topic={topic}
					page={currentPage}
					{...this.props}
				/>
			</Router.Locations>
		);
	}

});
