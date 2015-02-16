
'use strict';

var React = require('react');

var Actions = require('../Actions');
var Button = require('common/forms/components/Button');

var LogoutButton = React.createClass({
	render: function() {
		return(
			<Button onClick={Actions.logOut}>Log Out</Button>
		);
	}
});

module.exports = LogoutButton;
