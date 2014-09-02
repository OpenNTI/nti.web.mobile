/** @jsx React.DOM */

'use strict';

// global.React = require('react'); // needed for the react devtools chrome extension.

var React = require('react/addons');

var Login = require('./login');
var AppDispatcher = require('./common/dispatcher/AppDispatcher');
var LoginView = Login.LoginView;
var LoginStore = Login.LoginStore;
var LoginStoreProperties = Login.LoginStoreProperties;
var NavigationActions = require('./navigation/NavigationActions');
var NavigationConstants = require('./navigation/NavigationConstants');
var Forms = require('./common/components/forms')

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

var errorNotFound = React.createClass({
	render: function() {
		return (
			<div>not found</div>
		);
	}
});

function _loginStoreChange(evt) {
	console.log('App received loginStoreChange %O', evt);
	if(evt && evt.property === LoginStoreProperties.isLoggedIn) {
		if(evt.value) {
			console.log('Logged in. Redirect to content?');
			NavigationActions.navigate('/testing123/');
		}
		else {
			console.log('Logged out. Redirect to login?');
			NavigationActions.navigate('/login/');
		}
	}
}

var App = React.createClass({


	// componentWillMount: function() {
	// 	Login.LoginController.addChangeListener(function(e) {
	// 		debugger;
	// 		console.log('app component logincontroller change listener invoked.');
	// 	});
	// 	// initialize the login system to find out whether we're logged in.
	// 	Login.LoginActions.begin();
	// },

	_actionHandler:function(payload) {
		var action = payload.action;
		console.log('App received %s action.', action.actionType);
		switch(action.actionType) {
			case NavigationConstants.NAVIGATE:
				this.refs.router.navigate(action.href);
			break;
		}
		return true; // No errors. Needed by promise in Dispatcher.
	},

	componentWillMount: function() {
		LoginStore.addChangeListener(_loginStoreChange);
		AppDispatcher.register(this._actionHandler);
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(_loginStoreChange);
		AppDispatcher.unregister(this._actionHandler);
	},

	render: function() {
		require('../resources/scss/app.scss');
		return (
			<div>
				<Locations ref="router" path={this.props.path}>
					<NotFound handler={errorNotFound} />
					<Location path={this.props.basePath + 'login/'} handler={LoginView} />
					<Location path={'/login/'} handler={LoginView} />
					<Location path={'/testing123/'} handler={Test} />
				</Locations>
				<Login.LogoutButton />
			</div>
		);
	}
});

module.exports = App;
