'use strict';
require('script!babel/browser-polyfill');
require('babel/polyfill');

var React = require('react');

require('common/utils').overrideConfigAndForceCurrentHost();//ensures we talk back to our current host instead of anything else.

require('../../resources/scss/app.scss');

//Client code, injects script blocks into <HEAD> tag
require('script!../../resources/vendor/modernizr/modernizr.js');

require('fastclick').attach(document.body);




React.initializeTouchEvents(true);





var WidgetView = React.createFactory(require('./widget'));
React.render(
	WidgetView(),
	document.getElementById('content')
);
