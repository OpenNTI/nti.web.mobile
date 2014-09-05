/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

//FIX: This seems like we can clean up this and move "logic" up to the app level and out of the view.
var AppDispatcher = require('./common/dispatcher/AppDispatcher');

//Main Views
var HomeView = require('./home').View;
var LibraryView = require('./library').View;
var NotFoundView = require('./notfound').View;


//Lets try to make the "login" package conceal these details. We can make an extended "Locations" router that listens to login events and can know if we're logged in or not.
var Login = require('./login');
var LoginView = Login.LoginView; //Can we get this down to just this? the View?
var LoginStore = Login.LoginStore;
var LoginStoreProperties = Login.LoginStoreProperties;

var AppContainer = require('./common/components/AppContainer');

//Not sure this is needed...
var NavigationActions = require('./navigation/NavigationActions');
var NavigationConstants = require('./navigation/NavigationConstants');


var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var NotFound = Router.NotFound;


var Test = React.createClass({render: function() {return (<div>Test</div>);}});


function _loginStoreChange(evt) {
	console.log('App received loginStoreChange %O', evt);
	if(evt && evt.property === LoginStoreProperties.isLoggedIn) {
		if(evt.value) {
			console.log('Logged in. Redirect to content?');
			NavigationActions.navigate($AppConfig.basepath + '/library/');
		}
		else {
			console.log('Logged out. Redirect to login? %O');
			NavigationActions.navigate($AppConfig.basepath + '/login/');
		}
	}
}

var App = React.createClass({

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
		var router = (
			<Locations ref="router" path={this.props.path}>
				<Location path={this.props.basePath + 'login/*'} handler={LoginView} />
				<Location path={this.props.basePath + 'library/*'} handler={LibraryView} />
				<Location path={this.props.basePath} handler={HomeView} />
				<NotFound handler={NotFoundView} />
			</Locations>
		);

		return (
			<div>
				<AppContainer router={router} />
				<Login.LogoutButton />
			</div>
		);
	}
});

module.exports = App;
