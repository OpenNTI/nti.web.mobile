/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var OwnerQuery = require('common/mixins/OwnerQuery');
// var CourseFilters = require('../../library/mixins/CourseFilters');

var Item = require('./Entry');

module.exports = React.createClass({
	displayName: 'Collection',
	mixins: [OwnerQuery],

	propTypes: {
		title: React.PropTypes.string.isRequired,
		list: React.PropTypes.object.isRequired
	},

	render: function() {
		var list = this.props.list || [];
		var basePath = this.props.basePath;
		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;

		// var fbar = this.filterBar();

		// if (this.state.activeFilter) {
		// 	list = this.filter(list);
		// }

		return (
			<div>
				<div className="grid-container">
					<h2>{this.props.title}</h2>
					<ul className={'small-block-grid-' + size + ' medium-block-grid-3 large-block-grid-4'}>
					{list.map(function(o) {
						return <Item key={o.NTIID} item={o} basePath={basePath}/>;
					})}
					</ul>
				</div>
			</div>
		);
	}
});
