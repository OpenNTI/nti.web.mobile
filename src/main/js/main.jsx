/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

//FIX: This seems like we can clean up this and move "logic" up to the app level and out of the view.
var AppDispatcher = require('./common/dispatcher/AppDispatcher');


var AppContainer = require('./common/components/AppContainer');

var Login = require('./login');
var LoginStore = Login.LoginStore;
var LoginStoreProperties = Login.LoginStoreProperties;
var NavigationConstants = require('./navigation/NavigationConstants');
var NavigationActions = require('./navigation/NavigationActions');
var Router = require('./navigation/components/Router');

var App = React.createClass({

	_actionHandler:function(payload) {
		var action = payload.action;
		console.log('App received %s action.', action.actionType);
		switch(action.actionType) {
			case NavigationConstants.NAVIGATE:
				console.log('App received %O.', action);
				Environment.defaultEnvironment.navigate(action.href, {replace:true});
			break;
		}
		return true; // No errors. Needed by promise in Dispatcher.
	},


	_loginStoreChange: function(evt) {
		console.log('App received loginStoreChange %O', evt);
		if(evt && evt.property === LoginStoreProperties.isLoggedIn) {
			if(evt.value) {
				console.log('Logged in. Redirect to content?');
				NavigationActions.navigate(this.props.basePath + 'library/');
			}
			else {
				console.log('Logged out. Redirect to login? %O');
				NavigationActions.navigate(this.props.basePath + 'login/');
			}
		}
	},

	componentWillMount: function() {
		LoginStore.addChangeListener(this._loginStoreChange);
		AppDispatcher.register(this._actionHandler);
	},

	componentWillUnmount: function() {
		LoginStore.removeChangeListener(this._loginStoreChange);
		AppDispatcher.unregister(this._actionHandler);
	},

	render: function() {
		require('../resources/scss/app.scss');
		var basePath = this.props.basePath;
		return (
			<div>
				<AppContainer>
					<Router path={this.props.path} basePath={basePath}/>
				</AppContainer>
				<Login.LogoutButton />
			</div>
		);
	}
});

module.exports = App;
