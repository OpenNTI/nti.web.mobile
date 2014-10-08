/** @jsx React.DOM */

'use strict';


var React = require('react/addons');

var filters = {
	'Current': function(item,index,array) {
		var startDate = new Date(item.CourseInstance.CatalogEntry.StartDate);
		var endDate = new Date(item.CourseInstance.CatalogEntry.EndDate);
		var now = new Date();
		return startDate < now && endDate > now;
	},
	'Upcoming': function(item,index,array) {
		var startDate = new Date(item.CourseInstance.CatalogEntry.StartDate);
		var now = new Date();
		return startDate > now;
	},
	'Archived': function(item,index,array) {
		var endDate = new Date(item.CourseInstance.CatalogEntry.EndDate);
		var now = new Date();
		return endDate < now;
	}
};

var CourseFilterMixin = {
	_onFilterClick: function(filterName) {
		this.setState({
			activeFilter: filterName
		});
	},

	componentWillMount: function() {
		this.setState({activeFilter: Object.keys(filters)[0]});
	},

	filter: function(list) {
		return list.filter(filters[this.state.activeFilter]);
	},

	filterBar: function() {
		var filterItems = Object.keys(filters).map(function(key,index,array) {
			var isActive = this.state.activeFilter === key;
			return <dd className={isActive ? 'active' : null}><a href="#" onClick={this._onFilterClick.bind(this,key)}>{key}</a></dd>
		}.bind(this));

		var filterBar = filterItems.length === 0 ? null : (
			<dl className="sub-nav">
				{filterItems}
			</dl>
		);

		return filterBar;
	}
};

module.exports = exports = CourseFilterMixin;
