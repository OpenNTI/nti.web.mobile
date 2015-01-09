/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

var Store = require('../Store');
var Api = require('../Api');
var Constants = require('../Constants');

// var RootView = require('./views/RootView');
var Group = require('./views/Group');
var Board = require('./views/Board');
var Forum = require('./views/Forum');
var Topic = require('./views/Topic');
var Post = require('./views/Post');

var Redirect = require('navigation/components/Redirect');

var TabBar = require('./GroupsTabBar');

var Loading = require('common/components/Loading');

var View = React.createClass({

	displayName: 'discussions/View',

	getInitialState: function() {
		return {
			loading: false
		};
	},

	componentDidMount: function() {
		if(!Store.getDiscussions()) {
			this.setState({
				loading: true
			});
			Store.addChangeListener(this._storeChanged);
			this._load();	
		}
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	_load: function() {
		console.debug('loadDiscussions');
		Api.loadDiscussions(this.props.course);
	},

	_storeChanged: function(event) {
		switch(event.type) {
			case Constants.DISCUSSIONS_CHANGED:
				console.debug('discussions changed. setting state loading: false');
				this.setState({
					loading: false
				});
				break;
		}
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var course = this.props.course;
		var courseId = course.getID();

		var discussions = Store.getDiscussions();

		return (
			<div>
				<div>(course name) discussions</div>
				<TabBar groups={discussions} />
				<div className="forums-wrapper">
					<Router.Locations contextual>
						<Router.Location path="/"
											handler={Redirect}
											location='/Open/'
											basePath={this.props.basePath} />

						<Router.Location path="/:groupId/"
											handler={Group}
											groups={discussions}
											courseId={courseId}
											basePath={this.props.basePath} />

						<Router.Location path="/:groupId/:boardId/"
											handler={Board}
											courseId={courseId}
											basePath={this.props.basePath} />

						<Router.Location path="/:groupId/:boardId/:forumId/"
											handler={Forum}
											course={course}
											basePath={this.props.basePath} />

						<Router.Location path="/:groupId/:boardId/:forumId/:topicId/"
											handler={Topic}
											course={course}
											basePath={this.props.basePath} />

						<Router.Location path="/:groupId/:boardId/:forumId/:topicId/:postId/"
											handler={Post}
											course={course}
											basePath={this.props.basePath} />									

						<Router.NotFound handler={Redirect}
										location='/Open/'
										basePath={this.props.basePath} />
					</Router.Locations>
				</div>
			</div>
		);

	}

});

module.exports = View;
