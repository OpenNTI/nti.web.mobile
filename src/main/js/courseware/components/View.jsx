/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;
var Store = require('../Store');

var IconBar = require('./IconBar');
var CoursewareSection = require('./CoursewareSection');

var Redirect = require('common/components/Redirect');

function sectionRoutes(basePath) {
	var sections = Store.getSectionNames();
	
	var routes = sections.map(function(section) {
		return Location({
			path: '/' + section + '/*',
			handler: CoursewareSection,
			section: section,
			basePath: basePath
		});
	});

	var defaultRoute = DefaultRoute({
		handler: Redirect,
		location: '/' + sections[0] + '/'
	});

	routes.push(defaultRoute);
	return routes;
}

var View = React.createClass({

	render: function() {
		var basePath = this.props.basePath;
		return Locations({contextual: true}, sectionRoutes(basePath));
	}

});

module.exports = View;
