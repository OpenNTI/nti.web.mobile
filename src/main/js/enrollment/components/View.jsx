/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

var Enroll = require('./Enroll');
var DropCourse = require('./DropCourse');

module.exports = React.createClass({
	displayName: 'enrollment:View',

	render: function() {
    	return (
			<Router.Locations contextual>
			<Router.Location path="/drop/" handler={DropCourse} basePath={this.props.basePath} entryId={this.props.entryId} />
                <Router.Location path="*" handler={Enroll} basePath={this.props.basePath} entryId={this.props.entryId} />
			</Router.Locations>
	    );
	}
});
