/**
* @module nt-mobile
*/

'use strict';

global.React = require('react/addons');

var App = require('./main');

React.renderComponent(
	App({basePath: $AppConfig.basepath || '/'}),
	document.getElementById('content')
);

// React.renderComponent(<Nav />, document.getElementById('content'));
// React.renderComponent(<LoginPanel />, document.getElementById('content'));

$(document).foundation();
