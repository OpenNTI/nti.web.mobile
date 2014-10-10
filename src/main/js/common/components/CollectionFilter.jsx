/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var Link = require('react-router-component').Link;
var DefaultRoute = Router.NotFound;

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

var Test = React.createClass({

	/**
	* filter the list according using the currently selected filter.
	*/
	filter: function(list) {

		// default to the first filter
		var fkeys = Object.keys(this.props.filters);
		var fname = fkeys.length > 0 ? fkeys[0] : undefined;

		if (this.props.filtername) { // filter specified in the url, e.g. library/courses/archived
			for(var i = 0; i < fkeys.length; i++) {
				if (this.props.filtername === fkeys[i].toLowerCase()) {
					fname = fkeys[i];
					break;
				}
			}
		}

		var selectedFilter = this.props.filters[fname];
		return selectedFilter ? list.filter(selectedFilter) : list;
	},

	render: function() {

		var filterLinks = Object.keys(this.props.filters||{}).map(function(value,index,array) {
			var isActive = this.props.filtername === value.toLowerCase();
			return <dd className={isActive ? 'active' : null}><Link href={'/' + value.toLowerCase()}>{value}</Link></dd>
		}.bind(this));

		var filterBar = filterLinks.length === 0 ? null : (
			<dl className="sub-nav">
				{filterLinks}
			</dl>
		);

		var listComponent = React.addons.cloneWithProps(this.props.listcomp, {
			list: this.filter(this.props.list)
		});

		return (
			<div>
				{filterBar}
				(filtername: {this.props.filtername} xxxxx)
				<div>{listComponent}</div>
			</div>
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
			list: [],
			filters: {}
		};
	},

	// _onFilterClick: function(filterName) {
	// 	this.setState({
	// 		activeFilter: filterName
	// 	});
	// },

	hasFilters: function() {
		return Object.keys(this.props.filters).length > 0;
	},

	filterBar: function() {
		if (! this.hasFilters()) {
			return null;
		}

		var filterItems = Object.keys(this.props.filters).map(function(key,index,array) {
			var isActive = this.props.filtername === key.toLowerCase();
			return <dd className={isActive ? 'active' : null}><Link href={key.toLowerCase()}>{key}</Link></dd>
		}.bind(this));

		var filterBar = filterItems.length === 0 ? null : (
			<dl className="sub-nav">
				{filterItems}
			</dl>
		);

		return filterBar;
	},

	// componentWillMount: function() {
	// 	var fkeys = Object.keys(this.props.filters);
	// 	var fname = fkeys.length > 0 ? fkeys[0] : undefined;

	// 	if (this.props.filtername) { // filter specified in the url, e.g. library/courses/archived
	// 		for(var i = 0; i < fkeys.length; i++) {
	// 			if (this.props.filtername === fkeys[i].toLowerCase()) {
	// 				fname = fkeys[i];
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	this.setState({activeFilter: fname});
	// },

	
	_reroute: function() {
		return (React.DOM.div({}));
	},

	render: function() {

		var listView = React.addons.cloneWithProps(this.props.children, {
			list: this.props.list
		});

		var list = this.props.list;
		var filters = this.props.filters;


		return (
			<Locations contextual>
				<Location path='/:filtername' handler={Test} list={list} listcomp={listView} filters={filters} />
				<DefaultRoute handler={Test} list={list} listcomp={listView} filters={filters} />
			</Locations>
		);
	}

});

module.exports = Filter;
