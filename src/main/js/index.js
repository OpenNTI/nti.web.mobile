'use strict';
/**
 * @module nt-mobile
 */
$AppConfig.server = require('dataserverinterface/utils/forcehost')($AppConfig.server);

var React = require('react/addons');

require('script!../resources/vendor/modernizr/modernizr.js');
require('script!../resources/vendor/fastclick/lib/fastclick.js');
require('script!../resources/vendor/jquery/dist/jquery.min.js');
require('script!../resources/vendor/foundation/js/foundation.min.js');

console.debug('Client is using host: %s', $AppConfig.server);

var OrientationHandler = require('common/Utils').Orientation;
var AppDispatcher = require('common/dispatcher/AppDispatcher');
var AppView = require('./main');

var EventPluginHub = require('react/lib/EventPluginHub');
var ResponderEventPlugin = require('common/thirdparty/ResponderEventPlugin');
var TapEventPlugin = require('common/thirdparty/TapEventPlugin');

EventPluginHub.injection.injectEventPluginsByName({
	ResponderEventPlugin: ResponderEventPlugin,
	TapEventPlugin: TapEventPlugin
});


React.initializeTouchEvents(true);


if (global.addEventListener) {
	global.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false);
}


//FIXME: We should have a formal init somewhere...
require('./notifications').Actions.load();


var app = React.renderComponent(
	AppView({basePath: $AppConfig.basepath || '/'}),
	document.getElementById('content')
);

OrientationHandler.init(app);

global.onbeforeunload = function() {
	app.setState({mask: 'Exiting...'});
};
