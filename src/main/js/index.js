import 'babel-polyfill';//applies hooks into global

import React from 'react';
import ReactDOM from 'react-dom';

import {addFeatureCheckClasses} from 'nti-lib-dom';
import {initAnalytics, endSession, resumeSession} from 'nti-analytics';
import {init as initLocale} from 'nti-lib-locale';

import {VisibilityMonitor, Orientation} from 'nti-lib-dom';
import {ensureTopFrame} from 'common/utils/iframe-buster';
import {overrideConfigAndForceCurrentHost, getServerURI, getReturnURL, getConfigFor} from 'nti-web-client';

/**
 * Login Store State Change listener.
 * This is only responsible for reloading the APP on the home url once logged in.
 * The node service is responsible for enforcing auth-required pages.
 */
import {LOGIN_STATE_CHANGED} from 'login/Constants';
import LoginStore from 'login/Store';

import AppView from './app/View';
//webpack magic
import '../resources/scss/app.scss';

initLocale();
addFeatureCheckClasses();

//After bundle CSS is injected, lets move this back down so it overrides the bundle.
// This is the Browser's entry point, we can assume the existence of "document".
const siteCSS = document.getElementById('site-override-styles');
if (siteCSS) { siteCSS.parentNode.appendChild(siteCSS); }

ensureTopFrame();

overrideConfigAndForceCurrentHost();

console.debug('Client is using host: %s', getServerURI()); //eslint-disable-line

const basePath = (x => (x = getConfigFor(x), typeof x === 'string' ? x : '/'))('basepath');


ReactDOM.render(
	React.createElement(AppView, {
		basePath,
		ref: onAppMount,
		canRunStandalone: ('standalone' in navigator),
		isRunningStandalone: ('standalone' in navigator) && navigator.standalone
	}),
	document.getElementById('content')
);

function onAppMount (APP) {

	initAnalytics();
	window.addEventListener('beforeunload', ()=> endSession());
	VisibilityMonitor.addChangeListener(visible => {
		const fn = visible
			? resumeSession
			: endSession;

		fn('visiblity changed');
	});

	Orientation.init(APP);
	global.onbeforeunload = () => { APP.setState({mask: 'Reloading...'}) };

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

}
