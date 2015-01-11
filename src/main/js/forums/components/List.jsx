'use strict';

var React = require('react/addons');
var ListItems = require('./list-items');
var hash = require('object-hash');

module.exports = React.createClass({
	displayName: 'ForumItemList',

	propTypes: {
		container: React.PropTypes.shape({
			Items: React.PropTypes.array
		}).isRequired
	},

	keyFor(item) {
		return hash(item);
	},

	render: function() {
		var {Items} = this.props.container;
		var keyFor = this.props.keyFn || this.keyFor;
		var {itemProps} = this.props;

		return (
			<ul {...this.props}>
				{Items.map((item, index)=>{
					return <li key={keyFor(item)}>{ListItems.select(item, index, itemProps)}</li>;
				}
				)}
			</ul>
		);
	}
});
