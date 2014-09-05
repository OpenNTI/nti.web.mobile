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

//TODO: dispatcher require goes here?
var AppView = require('./main');

React.renderComponent(
	AppView({basePath: $AppConfig.basepath || '/'}),
	document.getElementById('content')
);

$(document).foundation();//Does this need to be called per-component render (scoped to the component)?
