/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

//Main Views
var Login = require('login');
var Home = require('home');

var Contact = require('contact');
var Content = require('content');
var Course = require('course');
var Library = require('library');
var Enrollment = require('enrollment');

var NotFound = require('notfound');

var Redirect = require('navigation/components/Redirect');

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

				<Router.Location path={basePath + 'library/*'} handler={Library.View} basePath={basePath} />
				<Router.Location path={basePath + 'courseware*'} handler={Redirect} location={basePath + 'library/'} />

				<Router.Location path={basePath + 'content/:pkgId/*'} handler={Content.View} basePath={basePath} />
				<Router.Location path={basePath + 'course/:course/*'} handler={Course.View} basePath={basePath} />
				<Router.Location path={basePath + 'enroll/:course/*'} handler={Enrollment.View} basePath={basePath} />

				<Router.Location path={basePath + 'contact/:configname/'} handler={Contact.View} basePath={basePath} />

				<Router.Location path={basePath} handler={Home.View} basePath={basePath} />
				<Router.NotFound handler={NotFound.View} />
			</Router.Locations>
		);
	}

});
