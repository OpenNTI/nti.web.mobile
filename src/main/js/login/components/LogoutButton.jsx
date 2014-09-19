/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var LoginActions = require('../LoginActions');
var Button = require('common/components/forms/Button');

var LogoutButton = React.createClass({
	render: function() {
		return(
			<Button onClick={LoginActions.logOut}>Log Out</Button>
		);
	}
});

module.exports = LogoutButton;
