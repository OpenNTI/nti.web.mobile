/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Api = require('../../Api');
var Store = require('../../Store');
var Constants = require('../../Constants');

var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var TopicList = require('../TopicList');
var Topics = require('./Topics');
var Topic = require('./Topic');
var Post = require('./Post');
var Loading = require('common/components/Loading');
var NTIID = require('dataserverinterface/utils/ntiids');
var TabBar = require('../GroupsTabBar');
var Router = require('react-router-component');
var Location = Router.Location;

module.exports = React.createClass({

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			loading: true
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
		this._loadData(this.props.forumId);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.forumId !== this.props.forumId) {
			this._loadData(nextProps.forumId);
		}
	},

	_storeChanged: function(event) {
		switch(event.type) {
			case Constants.OBJECT_CONTENTS_LOADED:
				var oid = NTIID.encodeForURI(event.object.getID());
				if (oid === this.props.forumId) {
					this.setState({
						loading: false,
						forum: event.object,
						contents: event.contents
					});
				}
				break;
		}
	},

	_loadData: function(forumId) {
		Api.getObjectContents(forumId);
	},

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		var href = this.makeHref([this.props.filterpath, this.props.forumId, ''].join('/'));
		var section = this.makeHref('../', true);
		return getContextProvider().then(context => {
			context.push({
				label: 'My Section',
				href: section
			});
			context.push({
				label: this.state.forum.title,
				href: href
			});
			return context;
		});
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var container = this.state.contents;

		return (
			<nav className="forum">
				<TabBar groups={this.props.discussions}/>
				<Router.Locations contextual>
					<Location path="/(#nav)"
						handler={Topics}
						container={container}
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
