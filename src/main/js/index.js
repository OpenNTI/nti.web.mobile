'use strict';
/* global FastClick */
require('dataserverinterface/polyfills');

var React = require('react/addons');
var Utils = require('common/Utils');
//var emptyFunction = require('react/lib/emptyFunction');
// var preventOverscroll = require('common/thirdparty/prevent-overscroll');

//Client code, injects script blocks into <HEAD> tag
require('script!../resources/vendor/modernizr/modernizr.js');
require('script!../resources/vendor/fastclick/lib/fastclick.js');
require('script!../resources/vendor/jquery/dist/jquery.min.js');
require('script!../resources/vendor/foundation/js/foundation.min.js');

//Allow CSS :active states:
//document.addEventListener("touchstart", emptyFunction, true);

Utils.__forceCurrentHost();
console.debug('Client is using host: %s', Utils.getServerURI());

var OrientationHandler = Utils.Orientation;

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

var AppView = React.createFactory(require('./AppView'));
var app = React.render(
	AppView({basePath: Utils.getBasePath() || '/'}),
	document.getElementById('content')
);

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
