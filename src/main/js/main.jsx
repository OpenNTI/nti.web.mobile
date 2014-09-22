/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var CaptureClicks = require('react-router-component/lib/CaptureClicks');

//FIX: This seems like we can clean up this and move "logic" up to the app level and out of the view.
var AppDispatcher = require('./common/dispatcher/AppDispatcher');



var Login = require('./login');
var LoginStore = Login.Store;
var LoginStoreProperties = Login.StoreProperties;

var Navigation = require('./navigation');

var AppContainer = require('./common/components/AppContainer');
var Router = require('./navigation/components/Router');

var App = React.createClass({

	_actionHandler:function(payload) {
		var action = payload.action;
		console.log('App received %s action.', action.actionType);
		switch(action.actionType) {
			case Navigation.Constants.NAVIGATE:
				console.log('App received %O.', action);
				Navigation.Actions.navigate(action.href, true);
			break;
		}
		return true; // No errors. Needed by promise in Dispatcher.
	},


	_loginStoreChange: function(evt) {
		console.log('App received loginStoreChange %O', evt);
		if(evt && evt.property === LoginStoreProperties.isLoggedIn) {
			if(evt.value) {
				console.log('Logged in. Redirect to content?');
				Navigation.Actions.navigate(this.props.basePath + 'library/', true);
			}
			else {
				console.log('Logged out. Redirect to login? %O');
				Navigation.Actions.navigate(this.props.basePath + 'login/', true);
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

	_onNavigation: function() {
		this.forceUpdate();
	},

	render: function() {
		require('../resources/scss/app.scss');
		var basePath = this.props.basePath;

		var path = this.props.path || location.href;
		var isLoginView = /\/login/i.test(path);

		var wrapper = isLoginView ? React.DOM.div : AppContainer;

		return (
			<CaptureClicks>
				<wrapper basePath={basePath}>
					<Router path={this.props.path} basePath={basePath} onNavigation={this._onNavigation}/>
				</wrapper>
			</CaptureClicks>
		);
	}
});

module.exports = App;
