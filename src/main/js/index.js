'use strict';
require('script!babel/browser-polyfill');


//TODO: find a way to get rid of this dirty import. All deps should come
// from node_modules, so switch to this in the future:
// 		https://www.npmjs.com/package/modernizr
// Its not a simple swap...otherwise I would have done that.
require('script!../resources/vendor/modernizr/modernizr.js');

var FastClick = require('fastclick');
var QueryString = require('query-string');
var React = require('react');
var {__forceCurrentHost, getServerURI} = require('common/utils');
var OrientationHandler = require('common/utils/orientation');
//var emptyFunction = require('react/lib/emptyFunction');
// var preventOverscroll = require('common/thirdparty/prevent-overscroll');


//Allow CSS :active states:
//document.addEventListener("touchstart", emptyFunction, true);

__forceCurrentHost();
console.debug('Client is using host: %s', getServerURI());

var EventPluginHub = require('react/lib/EventPluginHub');
var ResponderEventPlugin = require('common/thirdparty/ResponderEventPlugin');
var TapEventPlugin = require('common/thirdparty/TapEventPlugin');

EventPluginHub.injection.injectEventPluginsByName({
	ResponderEventPlugin: ResponderEventPlugin,
	TapEventPlugin: TapEventPlugin
});


FastClick.attach(document.body);

React.initializeTouchEvents(true);


// preventOverscroll(document.body);


// if (("standalone" in navigator) && !navigator.standalone){
// 	//Suggest Bookmarking to the home screen...
// }

var basePath = (global.$AppConfig || {}).basepath || '/';

var AppView = require('./AppView');
var app = React.render(
	React.createElement(AppView, {basePath: basePath}),
	document.getElementById('content')
);


var LoginActions = require('login/Actions');
var LoginStore = require('login/Store');
LoginStore.addChangeListener(function(evt) {
	var loc = global.location || {};
	var returnURL = QueryString.parse(loc.search).return;
	if (evt && evt.property === LoginStore.Properties.isLoggedIn) {
		if (evt.value) {
			LoginActions.deleteTOS();
			//app.navigate(returnURL || basePath, {replace:true});
			loc.replace(returnURL || basePath);
		}
		else {
			app.navigate(basePath + 'login/',  {replace:true});
		}
	}
});


//After bundle CSS is injected, lets move this back down so it overrides the bundle.
var site = document.getElementById('site-override-styles');
if (site) {site.parentNode.appendChild(site);}

var sscss = document.getElementById('server-side-style');

//Lets free some memory... the server sends styles to the initial page view looks
//correct while the bundle downloads/loads...once loaded and in place, we want to
//remove the styles the server injected, in favor of the client's bundled styles
//(probably 100% identical, but we can't cut it out of the bundle...so lets just
//remove this form the dom and free up memory)... It's served its purpose.
if (sscss) {
	sscss.parentNode.removeChild(sscss);
}

OrientationHandler.init(app);

global.onbeforeunload = function() {
	app.setState({mask: 'Reloading...'});
};
