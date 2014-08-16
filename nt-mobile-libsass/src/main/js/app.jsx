/** @jsx React.DOM */

'use strict';

// global.React = require('react'); // needed for the react devtools chrome extension.

var React = require('react/addons');

var LoginPanel = require('./login/components/LoginPanel');
var AppContainer = require('./common/components/AppContainer');

React.renderComponent(
	<AppContainer />,
	document.getElementById('content')
);

// React.renderComponent(<Nav />, document.getElementById('content'));
// React.renderComponent(<LoginPanel />, document.getElementById('content'));

$(document).foundation();
