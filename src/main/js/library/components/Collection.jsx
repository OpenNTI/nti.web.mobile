/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired,
		type: React.PropTypes.func.isRequired,
		list: React.PropTypes.array
	},


	render: function() {
		var Item = this.props.type;
		var list = this.props.list || [];

		return (
		<div>
			<h2>{this.props.title}</h2>
			<ul className="small-block-grid-1 medium-block-grid-3 large-block-grid-4">
			{list.map(function(o) {
				return <Item key={o.NTIID} item={o} />;
			})}
			</ul>
		</div>
		);
	}
});
