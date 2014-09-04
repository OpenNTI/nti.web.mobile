/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Collection = require('./Collection');

var Package = require('./Package');
var Bundle = require('./Bundle');

module.exports = React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired,
		library: React.PropTypes.object.isRequired
	},

	render: function() {

		var library = this.props.library || {};
		var list = [].concat(library.bundles || [], library.packages || []);

		return (
		<div>
			<h2>{this.props.title}</h2>
			<div>
			{list.map(function(o) {
				var Item = o.isBundle ? Bundle : Package;
				return <Item key={o.NTIID} item={o} />;
			})}
			</div>
		</div>
		);
	}
});
