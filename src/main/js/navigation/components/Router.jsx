/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

//Main Views
var Login = require('login');
var Home = require('home');
var Catalog = require('catalog');
var Content = require('content');
var Course = require('course');
var Courseware = require('courseware');
var Enrollment = require('enrollment');
var Library = require('library');
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
				<Router.Location path={basePath + 'library/*'} handler={Library.View} basePath={basePath} />
				<Router.Location path={basePath + 'catalog/*'} handler={Catalog.View} basePath={basePath} />
				<Router.Location path={basePath + 'content/:pkgId/*'} handler={Content.View} basePath={basePath} />
				<Router.Location path={basePath + 'course/:course/*'} handler={Course.View} basePath={basePath} />
				<Router.Location path={basePath + 'courseware/*'} handler={Courseware.View} basePath={basePath} />
				<Router.Location path={basePath + 'enroll/:course/*'} handler={Enrollment.View} basePath={basePath} />
				<Router.Location path={basePath} handler={Home.View} />
				<Router.NotFound handler={NotFound.View} />
			</Router.Locations>
		);
	}

});
