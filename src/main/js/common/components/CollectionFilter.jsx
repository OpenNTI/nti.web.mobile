/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var FilterBar = React.createClass({

	propTypes: {
		filters: React.PropTypes.object
	},

	render: function() {
		return (
			<div>(FilterBar)</div>
		);
	}

});

var Filter = React.createClass({

	propTypes: {
		list: React.PropTypes.array.isRequired,
		
		/**
			A (single) component for rendering the (filtered) list.
		*/
		children: React.PropTypes.component.isRequired,

		/** filters should be a collection of named filter functions.
		* for example:
		*	{
		* 		Odds: function(item,index,array) {
		* 			return index % 2 === 1;
		* 		},
		* 		Evens: function(item,index,array) {
		* 			return index % 2 === 0;
		* 		}
		*	}
		*/
		filters: React.PropTypes.object.isRequired
	},

	getDefaultProps: function() {
		return {
			list: []
		};
	},

	_onFilterClick: function(filterName) {
		this.setState({
			activeFilter: filterName
		});
	},

	filterBar: function() {
		var filterItems = Object.keys(this.props.filters).map(function(key,index,array) {
			var isActive = this.state.activeFilter === key;
			return <dd className={isActive ? 'active' : null}><a href="#" onClick={this._onFilterClick.bind(this,key)}>{key}</a></dd>
		}.bind(this));

		var filterBar = filterItems.length === 0 ? null : (
			<dl className="sub-nav">
				{filterItems}
			</dl>
		);

		return filterBar;
	},

	componentWillMount: function() {
		var fkeys = Object.keys(this.props.filters);
		var fname = fkeys.length > 0 ? fkeys[0] : undefined;
		this.setState({activeFilter: fname});
	},

	/**
	* filter the list according using the currently selected filter.
	*/
	filter: function(list) {
		var selectedFilter = this.props.filters[this.state.activeFilter];
		return selectedFilter ? list.filter(selectedFilter) : list;
	},

	render: function() {

		var listView = React.addons.cloneWithProps(this.props.children, {
			list: this.filter(this.props.list)
		});
		var filterBar = this.filterBar();

		return (
			<div>
				{filterBar}
				{listView}
			</div>
		);
	}

});

module.exports = Filter;
