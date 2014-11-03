/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;
var Store = require('../Store');
var Loading = require('common/components/Loading');

var CoursewareSection = require('./CoursewareSection');

var Redirect = require('common/components/Redirect');

function getSectionRoutes(basePath) {

	var sections = Store.getSectionNames();

	var routes = sections.map(function(section) {
		return Location({
			path: '/' + section + '/*',
			handler: CoursewareSection,
			section: section,
			basePath: basePath
		});
	});

	return Store.defaultSection().then(function(defaultSection) {
		var defaultRoute = DefaultRoute({
			handler: Redirect,
			location: '/' + defaultSection + '/'
		});

		routes.push(defaultRoute);
		return routes;
	});

}

var View = React.createClass({

	componentDidMount: function() {
		getSectionRoutes(this.props.basePath).then(function(routes) {
			this.setState({
				loading: false,
				routes: routes
			});
		}.bind(this));
	},

	getInitialState: function() {
		return {
			loading: true,
			routes: []
		};
	},

	render: function() {
		if(this.state.loading) {
			return (<Loading />);
		}
		//var basePath = this.props.basePath;
		return Locations({contextual: true}, this.state.routes);
	}

});

module.exports = View;
