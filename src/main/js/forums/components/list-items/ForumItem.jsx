'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');

/**
 * For lists of Forums, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'ForumListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.FORUM
		]
	},

	render: function() {
		var {item} = this.props;
		return (
			<div className="forum-item">
				<h3><a href={item.ID + '/'}>{item.title}</a></h3>
			</div>
		);
	}
});
