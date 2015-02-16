'use strict';

var React = require('react/addons');

var Store = require('../../Store');
var LoadForum = require('../../mixins/LoadForum');

var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var Topics = require('./Topics');
var Topic = require('./Topic');
var Post = require('./Post');
var CreateTopic = require('./CreateTopic');
var Loading = require('common/components/Loading');
var TabBar = require('../GroupsTabBar');
var Router = require('react-router-component');
var Location = Router.Location;

module.exports = React.createClass({

	mixins: [NavigatableMixin, LoadForum],

	getInitialState: function() {
		return {
			loading: true
		};
	},

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		var href = this.makeHref([this.props.filterpath, this.props.forumId, ''].join('/'));
		var section = this.makeHref('../', true);
		var forum = Store.getForum(this.props.forumId);
		return getContextProvider().then(context => {
			context.push({
				label: 'My Section',
				href: section
			});
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
				<TabBar groups={this.props.discussions}/>
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
						handler={Topic}
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
