/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Item = require('./Entry');

module.exports = React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired,
		list: React.PropTypes.object.isRequired
	},

	render: function() {
		var list = this.props.list || [];
		var basePath = this.props.basePath;
		return (
		<div className="grid-container">
			<h2>{this.props.title}</h2>
			<ul className="small-block-grid-1 medium-block-grid-3 large-block-grid-4">
			{list.map(function(o) {
				return <Item key={o.NTIID} item={o} basePath={basePath}/>;
			})}
			</ul>
		</div>
		);
	}
});
