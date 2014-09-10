'use strict';
/**
 * @module nt-mobile
 */

//TODO: move jQuery, foundation, typekit to requires()/provides() calls here and out of the html.

global.React = require('react/addons');

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

