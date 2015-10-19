require('babel/polyfill');//applies hooks into global

//TODO: find a way to get rid of this dirty import. All deps should come
// from node_modules, so switch to this in the future:
//  https://www.npmjs.com/package/modernizr
// Its not a simple swap...otherwise I would have done that.
require('script!../resources/vendor/modernizr/modernizr.js');//injects a <script> into the html

import FastClick from 'fastclick';

import React from 'react';
import ReactDOM from 'react-dom';
// import Relay from 'react-relay';

// import EventPluginHub from 'react/lib/EventPluginHub';
// import ResponderEventPlugin from 'common/thirdparty/ResponderEventPlugin';
// import TapEventPlugin from 'common/thirdparty/TapEventPlugin';

import {overrideConfigAndForceCurrentHost, getServerURI, getReturnURL} from 'common/utils';
import OrientationHandler from 'common/utils/orientation';


overrideConfigAndForceCurrentHost();
console.debug('Client is using host: %s', getServerURI());


// EventPluginHub.injection.injectEventPluginsByName({
// 	ResponderEventPlugin: ResponderEventPlugin,
// 	TapEventPlugin: TapEventPlugin
// });


FastClick.attach(document.body);


// preventOverscroll(document.body);


// if (("standalone" in navigator) && !navigator.standalone){
// 	//Suggest Bookmarking to the home screen...
// }

let basePath = (global.$AppConfig || {}).basepath || '/';

// Relay.injectNetworkLayer(
// 	new Relay.DefaultNetworkLayer(path.join(basePath, '/api/graphql'))
// );


import AppView from './AppView';

let app = ReactDOM.render(
	React.createElement(AppView, {basePath}),
	document.getElementById('content')
);


/**
 * Login Store State Change listener.
 * This is only responsible for reloading the app on the home url once logged in.
 * The node service is responsible for enforcing auth-required pages.
 */
import {LOGIN_STATE_CHANGED} from 'login/Constants';
import LoginStore from 'login/Store';

LoginStore.addChangeListener(evt => {
	let returnURL = getReturnURL();

	if (evt && evt.type === LOGIN_STATE_CHANGED) {
		if (LoginStore.isLoggedIn) {
			//app.navigate(returnURL || basePath, {replace:true});
			location.replace(returnURL || basePath);
		}

		//Future idea: if we ever broadcast a login state changed event and
		//the store reports not logged in (which it always will unless you
		//go through the login process for now) we can client-side redirect
		//to the login view.
		//
		//I currently have a better idea for this, so this block will
		//probably just go unused.
		else {
			app.navigate(basePath + 'login/', {replace: true});
		}
	}
});


//After bundle CSS is injected, lets move this back down so it overrides the bundle.
let site = document.getElementById('site-override-styles');
if (site) { site.parentNode.appendChild(site); }

OrientationHandler.init(app);

global.onbeforeunload = () => {
	app.setState({mask: 'Reloading...'});
};
