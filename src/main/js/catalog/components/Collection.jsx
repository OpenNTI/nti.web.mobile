/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var OwnerQuery = require('common/mixins/OwnerQuery');
var Filter = require('common/components/CollectionFilter');

var filters = {
	'Current': function(item,index,array) {
		var startDate = new Date(item.StartDate);
		var endDate = new Date(item.EndDate);
		var now = new Date();
		return startDate < now && endDate > now;
	},
	'Upcoming': function(item,index,array) {
		var startDate = new Date(item.StartDate);
		var now = new Date();
		return startDate > now;
	},
	'Archived': function(item,index,array) {
		var endDate = new Date(item.EndDate);
		var now = new Date();
		return endDate < now;
	}
};

var Item = require('./Entry');

var ListView = React.createClass({
	mixins: [OwnerQuery],

	render: function() {
		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;
		var basePath = this.props.basePath;
		return (
			<div className="grid-container">
				<ul className={'small-block-grid-' + size + ' medium-block-grid-3 large-block-grid-4'}>
				{this.props.list.map(function(o) {
					return <Item key={o.NTIID} item={o} basePath={basePath}/>;
				})}
				</ul>
			</div>
		);
	}

});

module.exports = React.createClass({
	displayName: 'Catalog:Collection',

	propTypes: {
		title: React.PropTypes.string.isRequired,
		list: React.PropTypes.object.isRequired,
		filters: React.PropTypes.object
	},

	render: function() {

		var basePath = this.props.basePath;

		return this.transferPropsTo(
			<Filter filters={filters}>
				<ListView title={this.props.title} basePath={basePath} />
			</Filter>
		);
	}
});
