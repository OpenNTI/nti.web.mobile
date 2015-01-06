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
			'forums.communityforum'
		]
	},

	render: function() {
		var {item} = this.props;

		console.debug(item.title);

		return (
			<div className="forum-item">
				<h3><a href={item.ID + '/'}>{item.title}</a></h3>
			</div>
		);
	}
});
