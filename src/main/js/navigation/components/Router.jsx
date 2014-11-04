/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

//Main Views
var Login = require('login');
var Home = require('home');

var Content = require('content');
var Course = require('course');
var Library = require('courseware');//TODO: rename package and route
var Enrollment = require('enrollment');

var NotFound = require('notfound');

module.exports = React.createClass({
	displayName: 'Router',


	onNavigation: function() {
		if (global.scrollTo) {
			global.scrollTo(0,0);
		}

		var action = this.props.onNavigation;
		if (action) {
			action();
		}
	},


	render: function() {
		var basePath = this.props.basePath;
		return (
			<Router.Locations path={this.props.path} onNavigation={this.onNavigation}>
				<Router.Location path={basePath + 'login/*'} handler={Login.View} basePath={basePath}/>

				<Router.Location path={basePath + 'content/:pkgId/*'} handler={Content.View} basePath={basePath} />
				<Router.Location path={basePath + 'course/:course/*'} handler={Course.View} basePath={basePath} />
				<Router.Location path={basePath + 'courseware/*'} handler={Library.View} basePath={basePath} />
				<Router.Location path={basePath + 'enroll/:course/*'} handler={Enrollment.View} basePath={basePath} />
				<Router.Location path={basePath} handler={Home.View} />
				<Router.NotFound handler={NotFound.View} />
			</Router.Locations>
		);
	}

});
