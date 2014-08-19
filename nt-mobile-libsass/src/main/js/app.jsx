/** @jsx React.DOM */

'use strict';

// global.React = require('react'); // needed for the react devtools chrome extension.

var React = require('react/addons');

var Login = require('./login');

var AppContainer = require('./common/components/AppContainer');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var Link = Router.Link;

var Test = React.createClass({
	render: function() {
		return (
			<div>Test</div>
		);
	}
});

var App = React.createClass({
	render: function() {
		return (
			<div>
				<Locations>
					<Location path="/mobile/" handler={Test} />
					<Location path="/mobile/login" handler={Login.LoginPanel} />
				</Locations>
				<Link href="/mobile/login">Log in</Link>
			</div>
		);
	}
});

React.renderComponent(
	App(),
	document.getElementById('content')
);


// React.renderComponent(<Nav />, document.getElementById('content'));
// React.renderComponent(<LoginPanel />, document.getElementById('content'));

$(document).foundation();
