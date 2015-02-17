import React from 'react';
import CaptureClicks from 'react-router-component/lib/CaptureClicks';

//FIX: This seems like we can clean up this and move "logic" up to the app level and out of the view.
import AppDispatcher from 'dispatcher/AppDispatcher';

import {
	addChangeListener as addLocaleChangeListener,
	removeChangeListener as removeLocaleChangeListener
} from 'common/locale';

import QueryString from 'query-string';

import LoginStore from 'login/Store';
import LoginStoreProperties from 'login/StoreProperties';
import LoginActions from 'login/Actions';

import NavigationActions from 'navigation/Actions';
import NavigationConstants from 'navigation/Constants';

import Router from './Router';
import Loading from 'common/components/Loading';

import AppContainer from './AppFrame';

export default React.createClass({
	displayName: 'App',

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


	_actionHandler (payload) {
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


	_loginStoreChange (evt) {
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


	getInitialState () {
		return {};
	},


	componentWillMount () {
		require('../resources/scss/app.scss');
	},


	componentDidMount () {
		addLocaleChangeListener(this._onStringsChange);
		LoginStore.addChangeListener(this._loginStoreChange);
		AppDispatcher.register(this._actionHandler);
	},


	componentWillUnmount () {
		removeLocaleChangeListener(this._onStringsChange);
		LoginStore.removeChangeListener(this._loginStoreChange);
		AppDispatcher.unregister(this._actionHandler);
	},


	_onNavigation () {
		this.forceUpdate();
		scrollTo(0,0);
	},


	_onStringsChange  () {
		this.forceUpdate();
	},


	render () {
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
