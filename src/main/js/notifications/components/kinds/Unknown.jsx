/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');

module.exports = React.createClass({
	mixins: [NoteableMixin],

	render: function() {
		return (
			<li className="notification-item">Unknown</li>
		);
	}
});
