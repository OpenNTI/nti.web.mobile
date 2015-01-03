'use strict';

var React = require('react/addons');
var ListItems = require('./list-items');

module.exports = React.createClass({
	displayName: 'ForumItemList',

	propTypes: {
		container: React.PropTypes.shapeOf({
			Items: React.PropTypes.array
		}).isRequired
	},

	render: function() {
		var {Items} = this.props.container;

		return (
			<div>
				{Items.map((item, index)=>
					ListItems.select(item, index)
				)}
			</div>
		);
	}
});
