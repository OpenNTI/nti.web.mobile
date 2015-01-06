/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

var Store = require('../Store');
var Api = require('../Api');
var Constants = require('../Constants');

var Forum = require('./Forum');
var Topic = require('./Topic');
var Post = require('./Post');

var Loading = require('common/components/Loading');

var RootView = require('./RootView');

var View = React.createClass({

	displayName: 'discussions/View',

	getInitialState: function() {
		return {
			loading: false
		};
	},

	componentDidMount: function() {
		if(!Store.hasData()) {
			this.setState({
				loading: true
			});
			Store.addChangeListener(this._storeChanged);
			this._load();	
		}
	},

	componentWillUnmount() {
		Store.removeChangeListener(this._storeChanged);
	},

	_load() {
		Api.loadDiscussions(this.props.course);
	},

	_storeChanged(event) {
		switch(event.type) {
			case Constants.DATA_CHANGE:
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

		return (
			<Router.Locations contextual>
				<Router.Location path="/"
									handler={RootView}
									discussions={Store.getData()}
									basePath={this.props.basePath} />

				<Router.Location path="/:forumId/"
									handler={Forum}
									basePath={this.props.basePath} />

				<Router.Location path="/:forumId/:topicId/"
									handler={Topic}
									basePath={this.props.basePath} />

				<Router.Location path="/:forumId/:topicId/:postId/"
									handler={Post}
									basePath={this.props.basePath} />									

				<Router.NotFound handler={RootView} course={course} />
			</Router.Locations>
		);

	}

});

module.exports = View;
