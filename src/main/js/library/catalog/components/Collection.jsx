'use strict';

var React = require('react/addons');
var OwnerQuery = require('common/mixins/OwnerQuery');
var Filter = require('common/components/CollectionFilter');
var Item = require('./Entry');

var filters = {
	'Upcoming': function(item) {
		var startDate = new Date(item.StartDate);
		var now = new Date();
		return startDate > now;
	},
	'Current': function(item) {
		var startDate = new Date(item.StartDate);
		var endDate = new Date(item.EndDate);
		var now = new Date();
		return startDate < now && endDate > now;
	},
	'Archived': function(item) {
		var endDate = new Date(item.EndDate);
		var now = new Date();
		return endDate < now;
	}
};

var ListView = React.createClass({
	mixins: [OwnerQuery],

	render: function() {
		var size = this.getStateFromParent('orientation') === 'landscape' ? 2 : 1;
		var basePath = this.props.basePath;
		if (!this.props.list.map) {
			console.warn('this.props.list doesn\'t have a map function? %O', this.props.list);
			return null;
		}
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
		title: React.PropTypes.string,

		/**
		*	An array or object with a filter() method.
		*/
		list: React.PropTypes.oneOfType([
			React.PropTypes.array,
			React.PropTypes.shape({
				filter: React.PropTypes.func
			})
		]).isRequired,

		filters: React.PropTypes.object
	},

	render: function() {

		var basePath = this.props.basePath;

		return (
			<Filter {...this.props} filters={filters}>
				<ListView title={this.props.title} basePath={basePath} />
			</Filter>
		);
	}
});
