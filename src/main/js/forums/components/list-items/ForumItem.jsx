'use strict';

var React = require('react/addons');

/**
 * For lists of Forums, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'ForumListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			'Forum'//Need to lookup type, this isn't it...i don't think
		]
	},

	render: function() {
		return (
			<div />
		);
	}
});
