/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'CourseOverviewUnknown',

	render: function() {
		var item = this.props.item;
		var type = (item.MimeType || 'Unknown').replace('application/vnd.nextthought.', '');
		console.debug('Unhandled Overview Item: %o', item);

		return (
			<div>Unknown Type: {type}</div>
		);
	}
});
