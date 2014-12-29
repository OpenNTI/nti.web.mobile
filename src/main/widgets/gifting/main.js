'use strict';
require('dataserverinterface/polyfills');

var React = require('react/addons');

var QueryString = require('query-string');

require('common/Utils').__forceCurrentHost();//ensures we talk back to our current host instead of anything else.

require('../../resources/scss/app.scss');

//Client code, injects script blocks into <HEAD> tag
require('script!../../resources/vendor/modernizr/modernizr.js');
require('script!../../resources/vendor/jquery/dist/jquery.min.js');
require('script!../../resources/vendor/foundation/js/foundation.min.js');

/** global FastClick */
//require('script!../../resources/vendor/fastclick/lib/fastclick.js');
//FastClick.attach(document.body);




//React.initializeTouchEvents(true);


var props = QueryString.parse(global.location.search);


var WidgetView = React.createFactory(require('./widget'));
React.render(
	WidgetView({
		purchasableId: props.purchasableId,
		headerImage: props.header
	}),
	document.getElementById('content')
);
