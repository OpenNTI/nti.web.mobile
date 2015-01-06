'use strict';

var React = require('react/addons');
var ListItems = require('./list-items');

module.exports = React.createClass({
	displayName: 'ForumItemList',

	propTypes: {
		container: React.PropTypes.shape({
			items: React.PropTypes.array
		}).isRequired
	},

	render: function() {
		var {items} = this.props.container;

		console.debug(items);

		return (
			<ul>
				{items.map((item, index)=>
					<li>{ListItems.select(item, index)}</li>
				)}
			</ul>
		);
	}
});
