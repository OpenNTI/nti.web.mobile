'use strict';
require('script!6to5/runtime');
require('script!6to5/browser-polyfill');
require('6to5/polyfill');

var React = require('react');

var QueryString = require('query-string');

require('common/Utils').__forceCurrentHost();//ensures we talk back to our current host instead of anything else.

require('../../resources/scss/app.scss');

//Client code, injects script blocks into <HEAD> tag
require('script!../../resources/vendor/modernizr/modernizr.js');

require('fastclick').attach(document.body);




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
