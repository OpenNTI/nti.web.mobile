/**
 * @jsx React.DOM
 */

var React = require('react/addons');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var IconBar = require('./IconBar');
var CoursewareSection = require('./CoursewareSection');

var Redirect = require('common/components/Redirect');

var View = React.createClass({

	_reroute: function() {
		return <div>courseware::view::not found</div>
	},

	render: function() {
		var basePath = this.props.basePath;
		return (
			<Locations contextual>
				<Location path='/:section/*' handler={CoursewareSection} basePath={basePath} />
				<DefaultRoute handler={Redirect} location='/courses/' />
			</Locations>
		);
	}

});

module.exports = View;
