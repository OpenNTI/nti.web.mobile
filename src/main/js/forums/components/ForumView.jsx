import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';
import {Loading, Mixins} from '@nti/web-commons';
import {StoreEventsMixin} from '@nti/lib-store';

import ContextSender from 'common/mixins/ContextSender';

import LoadForum from '../mixins/LoadForum';
import Store from '../Store';

import CreateTopic from './CreateTopic';
import Topics from './Topics';
import TopicView from './TopicView';

let Location = Router.Location;

export default createReactClass({
	displayName: 'ForumView',

	mixins: [
		Mixins.NavigatableMixin,
		StoreEventsMixin,
		LoadForum,
		ContextSender
	],

	propTypes: {
		forumId: PropTypes.string.isRequired,
		contentPackage: PropTypes.obj,
		contextID: PropTypes.string
	},

	backingStore: Store,
	backingStoreEventHandlers: {},

	componentWillMount () {
		const {contextID} = this.props;
		// if a user lands directly on a topic or post view without going through
		// the parent views the store may not have the package id.
		if (!Store.getContextID() && contextID) {
			Store.setContextID(contextID);
		}
	},


	getInitialState () {
		return {
			loading: true
		};
	},

	getContext () {
		let href = this.makeHref([this.props.forumId, ''].join('/'));
		let forum = Store.getForum(this.props.forumId);
		return Promise.resolve({
			label: (forum || {}).title || 'Forum',
			href
		});
	},

	render () {
		if (this.state.loading) {
			return <Loading.Mask />;
		}

		let {forumId} = this.props;
		let forum = Store.getForum(forumId);

		return (
			<nav className="forum">
				<Router.Locations contextual>
					<Location
						path="/"
						handler={Topics}
						{...this.props}
						forum={forum}
					/>
					<Location
						path="/newtopic/"
						handler={CreateTopic}
						forum={forum}
					/>
					<Location path="/:topicId(/*)" handler={TopicView} />
				</Router.Locations>
			</nav>
		);
	}
});
