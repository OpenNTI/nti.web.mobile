/** @jsx React.DOM */

'use strict';

// global.React = require('react'); // needed for the react devtools chrome extension.

var React = require('react/addons');

var Login = require('./login');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var NotFound = Router.NotFound;
var Link = Router.Link;

var Test = React.createClass({
	render: function() {
		return (
			<div>Test</div>
		);
	}
});

var App = React.createClass({

	// componentWillMount: function() {
	// 	Login.LoginController.addChangeListener(function(e) {
	// 		debugger;
	// 		console.log('app component logincontroller change listener invoked.');
	// 	});
	// 	// initialize the login system to find out whether we're logged in.
	// 	Login.LoginActions.begin();
	// },

	render: function() {
		return (
			<div>
				<Test />
				<Locations path={this.props.path}>
					<NotFound handler={Test} />
					<Location path="/mobile/" handler={Test} />
					<Location path="/mobile/login" handler={Login.LoginPanel} />
				</Locations>
				<Link href="/mobile/login">Log in</Link>		
			</div>
		);
	}
});

module.exports = App;
