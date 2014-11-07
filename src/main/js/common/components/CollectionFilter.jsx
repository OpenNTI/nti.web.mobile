/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var cloneWithProps  = require('react/lib/cloneWithProps');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var Link = Router.Link;
var DefaultRoute = Router.NotFound;

var NoMatches = require('./NoMatches');


var FilterBar = React.createClass({

	propTypes: {
		filters: React.PropTypes.object
	},


	getItemCount: function(filtername) {
		var filter = this.props.filters[filtername];
		if(filter && this.props.list.filter) {
			return this.props.list.filter(filter).length;
		}
		return 0;
	},


	render: function() {
		return (
			<div className="grid-container">
				<h2>{this.props.title}</h2>
				{this.renderFilterBar()}
			</div>
		);
	},


	renderFilterBar: function () {
		var filters = this.props.filters || {};
		return Object.keys(filters).length === 0 ? null : (
			<ul className="button-group filters">
				{Object.keys(filters).map(this.renderFilterLink)}
			</ul>
		);
	},


	renderFilterLink: function(filtername) {
		var isActive = this.props.filtername === filtername.toLowerCase();

		return (
			<li key={filtername} className={isActive ? 'active' : null}>
				<Link className="tiny button" href={'/' + filtername.toLowerCase()}>
					<span className="filtername">{filtername}</span>
					{' '/*preserves the space between spans*/}
					<span className="count">{this.getItemCount(filtername)}</span>
				</Link>
			</li>
		);
	}

});


var FilterableView = React.createClass({

	/**
	 * filter the list according using the currently selected filter.
	 */
	filter: function(list) {

		if (!(list && list.filter)) {
			console.error('List should be an array (or at least have a \'filter\' method. Returning an empty array. Received: %O', list);
			return [];
		}

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

		var filtered = this.filter(this.props.list);

		return (
			<div>
				{this.transferPropsTo(<FilterBar />)}
				{filtered.length === 0 ? <NoMatches /> : null}
				<div>
					{cloneWithProps(this.props.listcomp, { list: filtered,	omittitle: true	})}
				</div>
			</div>
		);
	}
});


var DefaultPath = React.createClass({
	mixins: [Router.NavigatableMixin],

	_navigateToDefaultFilter: function() {
		var filterName = this._defaultFilterName();
		if (filterName) {
			this.navigate('/' + filterName.toLowerCase(), {replace: true});
		}
	},

	/**
	 *	Returns the name first filter that doesn't result in an emtpy list,
	 *	or the first filter if all result in empty lists,
	 *	or null if this.props.filters.length === 0
	 */
	_defaultFilterName: function() {
		if (this.props.defaultFilter) {
			return this.props.defaultFilter;
		}
		var filterNames = Object.keys(this.props.filters||{});
		var result = filterNames.length > 0 ? filterNames[0] : null;
		filterNames.some(function(name) {
			var filter = this.props.filters[name];
			if (this.props.list.filter(filter).length > 0) {
				result = name;
				return true;
			}
			return false;
		},this);

		return result;
	},


	componentDidUpdate: function() {
		if(this.getPath() === '/') {
			this._navigateToDefaultFilter();
		}
	},


	componentDidMount: function() {
		if(this.getPath() === '/') {
			this._navigateToDefaultFilter();
		}
	},


	render: function() {
		return (<div>Redirecting to default filter.</div>);
		// return this.props.listcomp;
	}

});


var Filter = React.createClass({

	propTypes: {
		/**
		 *	An array or object with a filter() method.
		 */
		list: React.PropTypes.oneOfType([
			React.PropTypes.array,
			React.PropTypes.shape({
				filter: React.PropTypes.func
			})
		]),

		/**
		 *	A (single) component for rendering the (filtered) list.
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
		filters: React.PropTypes.object
	},


	getDefaultProps: function() {
		return {
			list: [],
			filters: {}
		};
	},


	render: function() {
		var filters = this.props.filters;
		var list = this.props.list;

		if(!filters || Object.keys(filters).length === 0) {
			//console.debug('No filters. Returning list view.');
			return cloneWithProps(this.props.children, {list: list});
		}

		return (
			<Locations contextual>
				{this.getRoutes()}
			</Locations>
		);
	},


	getRoutes: function () {
		var list = this.props.list;
		var listComp = this.props.children;
		var filters = this.props.filters;
		var title = this.props.title;

		var routes = Object.keys(filters).map(function(filtername) {
			var filterpath = filtername.toLowerCase();
			return Location({
				path: '/' + filterpath,
				filtername: filterpath,
				handler: FilterableView,
				list: list,
				listcomp: cloneWithProps(listComp, {list: list}),
				filters: filters,
				title: title
			});
		});

		routes.push(DefaultRoute({
			handler: DefaultPath,
			filters: this.props.filters,
			list: list,
			defaultFilter: this.props.defaultFilter
		}));

		return routes;
	},

});


module.exports = Filter;
