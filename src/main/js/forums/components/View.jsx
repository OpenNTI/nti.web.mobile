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
// var Bins = require('./views/Bins');
// var TabBar = require('./GroupsTabBar');

// var Group = require('./views/Group');
// var Board = require('./views/Board');
// var Forum = require('./views/Forum');
// var Topic = require('./views/Topic');
// var Post = require('./views/Post');

var Bin = require('./views/Bin');
var Redirect = require('navigation/components/Redirect');

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

	_defaultBinUri: function(discussions) {
		if (discussions) {
			var key = Object.keys(discussions)[0];
			return '/' + key + '/';	
		}
		return '/loading';
	},

	render: function() {

		var discussions = Store.getDiscussions();

		if (this.state.loading || !discussions) {
			return <Loading />;
		}

		var course = this.props.course;
		var courseId = course.getID();

		

		return (
			<div className="forums-wrapper">
				<Router.Locations contextual>
					<Router.Location path="/(#:nav)"
										handler={Redirect}
										location={this._defaultBinUri(discussions)}
										basePath={this.props.basePath} />

					<Router.Location path="/:binName/*(#:nav)"
										handler={Bin}
										discussions={discussions}
										courseId={courseId}
										basePath={this.props.basePath} />

				</Router.Locations>
			</div>
		);
	}

});

module.exports = View;
