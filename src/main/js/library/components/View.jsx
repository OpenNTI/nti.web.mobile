/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var Loading = require('common/components/Loading');
var Redirect = require('navigation/components/Redirect');

var Section = require('./Section');

var Sections = require('../Sections');

var View = React.createClass({

	getInitialState: function() {
		return {
			loading: true
		};
	},


	componentDidMount: function() {
		Sections.defaultSection().then(this.setDefaultSection);
	},


	setDefaultSection: function (name) {
		this.setState({
			loading: false,
			defaultSection: name
		});
	},


	render: function() {
		if(this.state.loading) {
			return (<Loading />);
		}

		return Locations({contextual: true}, this.getRoutes(this.props.basePath));
	},


	getRoutes: function (basePath) {
		var sections = Sections.getSectionNames();

		var routes = sections.map(function(section) {
			return Location({
				path: '/' + section + '/*',
				handler: Section,
				section: section,
				basePath: basePath
			});
		});

		if (this.state.defaultSection) {
			routes.push(DefaultRoute({
				handler: Redirect,
				location: '/' + this.state.defaultSection + '/'
			}));
		}

		return routes;
	}

});

module.exports = View;
