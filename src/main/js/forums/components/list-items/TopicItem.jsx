'use strict';

var React = require('react/addons');


/**
 * For lists of Topics, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'TopicListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			'Topic'//Need to lookup type, this isn't it...i don't think
		]
	},

	render: function() {
		return (
			<div />
		);
	}
});
