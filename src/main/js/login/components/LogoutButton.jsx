/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Actions = require('../Actions');
var Button = require('common/components/forms/Button');

var LogoutButton = React.createClass({
	render: function() {
		return(
			<Button onClick={Actions.logOut}>Log Out</Button>
		);
	}
});

module.exports = LogoutButton;
