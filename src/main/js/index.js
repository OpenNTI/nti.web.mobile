'use strict';
/**
 * @module nt-mobile
 */

require('script!../resources/vendor/modernizr/modernizr.js');
require('script!../resources/vendor/fastclick/lib/fastclick.js');
require('script!../resources/vendor/jquery/dist/jquery.min.js');
require('script!../resources/vendor/foundation/js/foundation.min.js');

if (global.addEventListener) {
	global.addEventListener('load', function() {
	    FastClick.attach(document.body);
	}, false);
}

global.React = require('react/addons');

function forceHost(s) {
	//Force our config to always point to our server...(client side)
	var url = require('url').parse(s);
	url.host = null;
	url.hostname = location.hostname;
	return url.format();
}

$AppConfig.server = forceHost($AppConfig.server);
console.debug('Client is using host: %s', $AppConfig.server);

var EventPluginHub = require('react/lib/EventPluginHub');

EventPluginHub.injection.injectEventPluginsByName({
	ResponderEventPlugin: require('./common/thirdparty/ResponderEventPlugin'),
	TapEventPlugin: require('./common/thirdparty/TapEventPlugin')
});

React.initializeTouchEvents(true);

var AppDispatcher = require('./common/dispatcher/AppDispatcher');
var AppView = require('./main');

//FIXME: We should have a formal init somewhere...
require('./notifications').Actions.load();



React.renderComponent(
	AppView({basePath: $AppConfig.basepath || '/'}),
	document.getElementById('content')
);
