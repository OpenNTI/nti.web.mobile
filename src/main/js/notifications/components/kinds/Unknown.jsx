/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');

module.exports = React.createClass({
	displayName: 'UnknownNotificationType',
	mixins: [NoteableMixin],

	render: function() {
		var change = this.props.item;
		var item = change.Item || change;
		var type = item.MimeType.replace('application/vnd.nextthought.', '');
		console.debug('Unhandled Notification Kind: %o', change);

		return (
			<li className="notification-item">Unknown {type}</li>
		);
	}
});
