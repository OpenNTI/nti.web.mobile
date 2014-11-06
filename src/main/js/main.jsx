/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var CaptureClicks = require('react-router-component/lib/CaptureClicks');

//FIX: This seems like we can clean up this and move "logic" up to the app level and out of the view.
var AppDispatcher = require('common/dispatcher/AppDispatcher');

var fromQueryString = require('dataserverinterface/utils/object-from-querystring');

var Login = require('login');
var LoginStore = Login.Store;
var LoginStoreProperties = Login.StoreProperties;
var LoginActions = Login.Actions;

var Navigation = require('navigation');

var Router = require('navigation/components/Router');
var AppContainer = require('common/components/AppContainer');
var Loading = require('common/components/Loading');


var App = React.createClass({

	_actionHandler: function(payload) {
		var action = payload.action;
		switch (action.actionType) {
			case Navigation.Constants.NAVIGATE:
				console.log('App received %O.', action);
				Navigation.Actions.navigate(action.href, true);
			break;
		}
		return true; // No errors. Needed by promise in Dispatcher.
	},


	_loginStoreChange: function(evt) {
		var loc = global.location || {};
		var returnURL = fromQueryString(loc.search).return;
		if (evt && evt.property === LoginStoreProperties.isLoggedIn) {
			if (evt.value) {
				LoginActions.deleteTOS();
				//Navigation.Actions.navigate(returnURL || this.props.basePath, true);
				loc.replace(returnURL || this.props.basePath);
			}
			else {
				Navigation.Actions.navigate(this.props.basePath + 'login/', true);
			}
		}
	},


	getInitialState: function() {
		return {};
	},


	componentWillMount: function() {
		require('../resources/scss/app.scss');
	},


	componentDidMount: function() {
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
		var basePath = this.props.basePath;

		var path = this.props.path || location.href;
		var isLoginView = /\/login/i.test(path);

		var wrapper = isLoginView ? React.DOM.div : AppContainer;

		if (this.state.mask) {
			return Loading({message: this.state.mask});
		}

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
