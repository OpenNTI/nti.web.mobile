/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Api = require('../../Api');
var Store = require('../../Store');
var Constants = require('../../Constants');

var TopicList = require('../TopicList');
var Topic = require('./Topic');
var Post = require('./Post');
var Loading = require('common/components/Loading');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavUp = require('../NavUp');
var TabBar = require('../GroupsTabBar');
var Router = require('react-router-component');
var Location = Router.Location;

module.exports = React.createClass({

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

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var container = this.state.contents;
		var forum = this.state.forum;

		return (
			<nav className="forum">
				<TabBar groups={this.props.discussions}/>
				<NavUp />
				<div>{forum.title}</div>
				<Router.Locations contextual>
					<Location path="/(#nav)"
						handler={TopicList}
						container={container}
					/>
					<Location path="/:topicId/(#nav)"
						handler={Topic}
					/>
					<Location path="/:topicId/:postId/(#nav)"
						handler={Post}
					/>
				</Router.Locations>
			</nav>
		);
	}

});
