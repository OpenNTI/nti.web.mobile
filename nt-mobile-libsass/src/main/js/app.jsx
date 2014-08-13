/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var LoginPanel = require('./components/LoginPanel');
var AppContainer = require('./components/AppContainer');

React.renderComponent(
	<AppContainer>
		<LoginPanel />
	</AppContainer>,
	document.getElementById('content')
);

// React.renderComponent(<Nav />, document.getElementById('content'));
// React.renderComponent(<LoginPanel />, document.getElementById('content'));

$(document).foundation();
