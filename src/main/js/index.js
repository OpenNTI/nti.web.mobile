import 'babel/polyfill';//applies hooks into global

//TODO: find a way to get rid of this dirty import. All deps should come
// from node_modules, so switch to this in the future:
//  https://www.npmjs.com/package/modernizr
// Its not a simple swap...otherwise I would have done that.
import 'script!../resources/vendor/modernizr/modernizr.js';//injects a <script> into the html

//After bundle CSS is injected, lets move this back down so it overrides the bundle.
// This is the Browser's entry point, we can assume the existence of "document".
let site = document.getElementById('site-override-styles');
if (site) { site.parentNode.appendChild(site); }

import FastClick from 'fastclick';
FastClick.attach(document.body);

import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import OrientationHandler from 'common/utils/orientation';
import {overrideConfigAndForceCurrentHost, getServerURI, getReturnURL} from 'common/utils';
overrideConfigAndForceCurrentHost();

console.debug('Client is using host: %s', getServerURI());

const basePath = (global.$AppConfig || {}).basepath || '/';

Relay.injectNetworkLayer(
	new Relay.DefaultNetworkLayer(path.join(basePath, '/api/graphql')));


import AppView from './AppView';

const APP = ReactDOM.render(
	React.createElement(AppView, {
		basePath,
		canRunStandalone: ('standalone' in navigator),
		isRunningStandalone: ('standalone' in navigator) && navigator.standalone
	}),
	document.getElementById('content')
);

OrientationHandler.init(APP);
global.onbeforeunload = () => APP.setState({mask: 'Reloading...'});







/**
 * Login Store State Change listener.
 * This is only responsible for reloading the APP on the home url once logged in.
 * The node service is responsible for enforcing auth-required pages.
 */
import {LOGIN_STATE_CHANGED} from 'login/Constants';
import LoginStore from 'login/Store';

LoginStore.addChangeListener(evt => {
	const RETURN_URL = getReturnURL();

	if (evt && evt.type === LOGIN_STATE_CHANGED) {
		if (LoginStore.isLoggedIn) {
			//APP.navigate(RETURN_URL || basePath, {replace:true});
			location.replace(RETURN_URL || basePath);
		}

		//Future idea: if we ever broadcast a login state changed event and
		//the store reports not logged in (which it always will unless you
		//go through the login process for now) we can client-side redirect
		//to the login view.
		//
		//I currently have a better idea for this, so this block will
		//probably just go unused.
		else {
			APP.navigate(basePath + 'login/', {replace: true});
		}
	}
});
