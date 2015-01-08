'use strict';

var React = require('react/addons');
var ListItems = require('./list-items');
var hash = require('object-hash');

module.exports = React.createClass({
	displayName: 'ForumItemList',

	propTypes: {
		container: React.PropTypes.shape({
			items: React.PropTypes.array
		}).isRequired
	},

	keyFor(item) {
		return hash(item);
	},

	render: function() {
		var {Items} = this.props.container;
		var keyFor = this.props.keyFn || this.keyFor;
		return (
			<ul {...this.props}>
				{Items.map((item, index)=>
					<li key={keyFor(item)}>{ListItems.select(item, index)}</li>
				)}
			</ul>
		);
	}
});
