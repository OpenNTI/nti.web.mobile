import 'babel-polyfill';//applies hooks into global

import React from 'react';
import ReactDOM from 'react-dom';

import CSS from 'fbjs/lib/CSSCore';

import isTouch from 'nti-lib-interfaces/lib/utils/is-touch-device';
import OrientationHandler from 'common/utils/orientation';
import {overrideConfigAndForceCurrentHost, getServerURI, getReturnURL} from 'common/utils';

import AppView from './AppView';
//webpack magic
import '../resources/scss/app.scss';



const RootNode = document.querySelector('html');
CSS.removeClass(RootNode, 'no-js');
CSS.addClass(RootNode, 'js');
CSS.addClass(RootNode, isTouch ? 'touch' : 'no-touch');

//After bundle CSS is injected, lets move this back down so it overrides the bundle.
// This is the Browser's entry point, we can assume the existence of "document".
const siteCSS = document.getElementById('site-override-styles');
if (siteCSS) { siteCSS.parentNode.appendChild(siteCSS); }

//temp until we design a better way:
if (typeof window !== 'undefined' && window.top !== window) {
	window.top.location.href = location.href;
	//If the frame busting code is blocked, tell them embedding is not supported.
	location.replace('iframe.html');
}

overrideConfigAndForceCurrentHost();

console.debug('Client is using host: %s', getServerURI()); //eslint-disable-line

const basePath = (global.$AppConfig || {}).basepath || '/';


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
