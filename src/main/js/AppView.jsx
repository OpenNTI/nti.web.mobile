'use strict';

var React = require('react');
var CaptureClicks = require('react-router-component/lib/CaptureClicks');

//FIX: This seems like we can clean up this and move "logic" up to the app level and out of the view.
var AppDispatcher = require('dispatcher/AppDispatcher');

var locale = require('common/locale');

var QueryString = require('query-string');

var LoginStore = require('login/Store');
var LoginStoreProperties = require('login/StoreProperties');
var LoginActions = require('login/Actions');

var NavigationActions = require('navigation/Actions');
var NavigationConstants = require('navigation/Constants');

var Router = require('./Router');
var Loading = require('common/components/Loading');

var AppContainer = require('./AppFrame');

var App = React.createClass({

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	childContextTypes: {
		basePath: React.PropTypes.string
	},

	getChildContext () {
		return {
			basePath: this.props.basePath
		};
	},


	_actionHandler: function(payload) {
		var action = payload.action;
		switch (action.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case NavigationConstants.NAVIGATE:
				console.log('App received %O.', action);
				NavigationActions.navigate(action.href, true);
			break;
		}
		return true; // No errors. Needed by promise in Dispatcher.
	},


	_loginStoreChange: function(evt) {
		var loc = global.location || {};
		var returnURL = QueryString.parse(loc.search).return;
		if (evt && evt.property === LoginStoreProperties.isLoggedIn) {
			if (evt.value) {
				LoginActions.deleteTOS();
				//Navigation.Actions.navigate(returnURL || this.props.basePath, true);
				loc.replace(returnURL || this.props.basePath);
			}
			else {
				NavigationActions.navigate(this.props.basePath + 'login/', true);
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
		locale.addChangeListener(this._onStringsChange);
		LoginStore.addChangeListener(this._loginStoreChange);
		AppDispatcher.register(this._actionHandler);
	},


	componentWillUnmount: function() {
		locale.removeChangeListener(this._onStringsChange);
		LoginStore.removeChangeListener(this._loginStoreChange);
		AppDispatcher.unregister(this._actionHandler);
	},


	_onNavigation: function() {
		this.forceUpdate();
		scrollTo(0,0);
	},


	_onStringsChange: function () {
		this.forceUpdate();
	},


	render: function() {
	var path = this.props.path || location.href;
		var isLoginView = /\/login/i.test(path);

		var Wrapper = isLoginView ? 'div' : AppContainer;

		if (this.state.mask) {
			return <Loading message={this.state.mask}/>;
		}

		return (
			<CaptureClicks>
				<Wrapper>
					<Router path={this.props.path} onNavigation={this._onNavigation}/>
				</Wrapper>
			</CaptureClicks>
		);
	}
});

module.exports = App;
