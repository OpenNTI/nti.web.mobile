'use strict';
require('script!babel/runtime');
require('script!babel/browser-polyfill');
require('babel/polyfill');

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
