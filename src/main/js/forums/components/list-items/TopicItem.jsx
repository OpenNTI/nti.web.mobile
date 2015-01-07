'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');

/**
 * For lists of Topics, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'TopicListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.TOPIC
		]
	},

	render: function() {
		var {item} = this.props;
		return (
			<div>{item.title}</div>
		);
	}
});
