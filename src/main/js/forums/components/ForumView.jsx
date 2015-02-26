'use strict';

import React from 'react';

import Store from '../Store';
import LoadForum from '../mixins/LoadForum';

import Breadcrumb from 'common/components/Breadcrumb';
import StoreEvents from 'common/mixins/StoreEvents';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import Topics from './Topics';
import TopicView from './TopicView';
import Post from './Post';
import CreateTopic from './CreateTopic';
import Loading from 'common/components/Loading';
import Router from 'react-router-component';

let Location = Router.Location;

module.exports = React.createClass({

	mixins: [
		NavigatableMixin,
		StoreEvents,
		LoadForum
	],

	backingStore: Store,

	getInitialState: function() {
		return {
			loading: true
		};
	},

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		var href = this.makeHref([this.props.forumId, ''].join('/'));
		var forum = Store.getForum(this.props.forumId);
		return getContextProvider().then(context => {
			context.push({
				label: (forum||{}).title,
				href: href
			});
			return context;
		});
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var {forumId} = this.props;
		var forum = Store.getForum(forumId);

		return (
			<nav className="forum">
				<Router.Locations contextual>
					<Location path="/(#nav)"
						handler={Topics}
						{...this.props}
						contextProvider={this.__getContext}
					/>
					<Location path="/newtopic/(#nav)"
						forum={forum}
						handler={CreateTopic}
						contextProvider={this.__getContext}
					/>
					<Location path="/:topicId/(#nav)"
						handler={TopicView}
						contextProvider={this.__getContext}
					/>
					<Location path="/:topicId/:postId/(#nav)"
						handler={Post}
						contextProvider={this.__getContext}
					/>
				</Router.Locations>
			</nav>
		);
	}

});
