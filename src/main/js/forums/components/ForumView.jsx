

import ContextSender from 'common/mixins/ContextSender';
import CreateTopic from './CreateTopic';
import LoadForum from '../mixins/LoadForum';
import Loading from 'common/components/Loading';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import React from 'react';
import Router from 'react-router-component';
import Store from '../Store';
import StoreEvents from 'common/mixins/StoreEvents';
import Topics from './Topics';
import TopicView from './TopicView';

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
		course: React.PropTypes.object //probably should be abstracted to be container or some 'interface'
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

		let {forumId, course} = this.props;
		let forum = Store.getForum(forumId);

		// if a user lands directly on a topic or post view without going through
		// the parent views the store may not have the course id.
		if (!Store.getCourseId() && course) {
			Store.setCourseId(course.getID());
		}

		return (
			<nav className="forum">
				<Router.Locations contextual>
					<Location path="/(#nav)"
						handler={Topics}
						{...this.props}
						forum={forum}
						contextProvider={this.__getContext}
					/>
					<Location path="/newtopic/(#nav)"
						handler={CreateTopic}
						forum={forum}
						contextProvider={this.__getContext}
					/>
					<Location path="/:topicId/*(#nav)"
						handler={TopicView}
						forum={forum}
						contextProvider={this.__getContext}
					/>
				</Router.Locations>
			</nav>
		);
	}

});
