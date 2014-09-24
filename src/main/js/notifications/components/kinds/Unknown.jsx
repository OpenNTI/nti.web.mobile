/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');

module.exports = React.createClass({
	displayName: 'UnknownNotificationType',
	mixins: [NoteableMixin],

	render: function() {
		console.debug('Unhandled Notification Kind: %o', this.state.change);
		console.debug(this.state.item);
		var type = this.state.item.MimeType.replace('application/vnd.nextthought.', '')
		return (
			<li className="notification-item">Unknown {type}</li>
		);
	}
});
