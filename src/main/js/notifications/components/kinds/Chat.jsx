'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');

// var Avatar = require('common/components/Avatar');
// var DisplayName = require('common/components/DisplayName');
// var DateTime = require('common/components/DateTime');

module.exports = React.createClass({
	displayName: 'Chat',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'messageinfo'
	},


	render: function() {
		return (
			<li className="notification-item">
			</li>
		);
	}
});
