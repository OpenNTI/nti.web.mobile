/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

var Loading = require('common/components/Loading');

var Store = require('../Store');
var Actions = require('../Actions');

var Enroll = require('./Enroll');

module.exports = React.createClass({
	displayName: 'enrollment:View',

	render: function() {
    	return (
			<Router.Locations contextual>
                <Router.Location path="*" handler={Enroll} basePath={this.props.basePath} course={this.props.course} />
			</Router.Locations>
	    );
	}
});
