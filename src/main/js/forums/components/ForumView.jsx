import React from 'react';
import Router from 'react-router-component';

import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import StoreEvents from 'common/mixins/StoreEvents';

import CreateTopic from './CreateTopic';
import Topics from './Topics';
import TopicView from './TopicView';

import LoadForum from '../mixins/LoadForum';

import Store from '../Store';

let Location = Router.Location;

export default React.createClass({

	displayName: 'ForumView',

	mixins: [
		NavigatableMixin,
		StoreEvents,
		LoadForum,
		ContextSender
	],

	propTypes: {
		forumId: React.PropTypes.string.isRequired,

		/**
		 * @type {object} Any model that implements getDiscussions() and getID()
		 */
		contentPackage: React.PropTypes.shape({
			getDiscussions: React.PropTypes.func,
			getID: React.PropTypes.func
		})
	},

	backingStore: Store,
	backingStoreEventHandlers: {},

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
			return <Loading />;
		}

		let {forumId, contentPackage} = this.props;
		let forum = Store.getForum(forumId);

		// if a user lands directly on a topic or post view without going through
		// the parent views the store may not have the package id.
		if (!Store.getPackageId() && contentPackage) {
			Store.setPackageId(contentPackage.getID());
		}

		return (
			<nav className="forum">
				<Router.Locations contextual>
					<Location path="/"
						handler={Topics}
						{...this.props}
						forum={forum}
					/>
					<Location path="/newtopic/"
						handler={CreateTopic}
						forum={forum}
					/>
					<Location path="/:topicId/*"
						handler={TopicView}
						forum={forum}
					/>
				</Router.Locations>
			</nav>
		);
	}

});
