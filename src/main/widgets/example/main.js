'use strict';
require('core-js/shim');

var React = require('react/addons');

require('common/Utils').__forceCurrentHost();//ensures we talk back to our current host instead of anything else.

require('../../resources/scss/app.scss');

//Client code, injects script blocks into <HEAD> tag
require('script!../../resources/vendor/modernizr/modernizr.js');

/* global FastClick */
require('script!../../resources/vendor/fastclick/lib/fastclick.js');
FastClick.attach(document.body);




React.initializeTouchEvents(true);





var WidgetView = React.createFactory(require('./widget'));
React.render(
	WidgetView(),
	document.getElementById('content')
);
