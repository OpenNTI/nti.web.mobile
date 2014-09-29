/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var OwnerQuery = require('common/mixins/OwnerQuery');

var Package = require('./Package');
var Bundle = require('./Bundle');
var Course = require('./Course');

module.exports = React.createClass({
	displayName: 'Collection',
	mixins: [OwnerQuery],

	propTypes: {
		title: React.PropTypes.string.isRequired,
		list: React.PropTypes.array.isRequired
	},

	render: function() {
		var list = this.props.list || [];
		var basePath = this.props.basePath;

		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;

		return (
		<div className="grid-container">
			<h2>{this.props.title}</h2>
			<ul className={'small-block-grid-' + size + ' medium-block-grid-3 large-block-grid-4'}>
			{list.map(function(o) {
				var Item = o.isBundle ?
					Bundle :
					o.isCourse ?
						Course :
						Package;

				return <Item key={o.NTIID} item={o} basePath={basePath}/>;
			})}
			</ul>
		</div>
		);
	}
});
