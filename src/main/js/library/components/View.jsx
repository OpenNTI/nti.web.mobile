/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var Loading = require('common/components/Loading');
var Redirect = require('common/components/Redirect');

var Section = require('./Section');

var Sections = require('../Sections');


function getSectionRoutes(basePath) {

	var sections = Sections.getSectionNames();

	var routes = sections.map(function(section) {
		return Location({
			path: '/' + section + '/*',
			handler: Section,
			section: section,
			basePath: basePath
		});
	});

	return Sections.defaultSection().then(function(defaultSection) {
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
