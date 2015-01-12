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
		filters: React.PropTypes.array
	},


	getItemCount: function(filter) {
		if(filter && this.props.list.filter) {
			return this.props.list.filter(filter.filter).length;
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
		var filters = this.props.filters || [];
		return filters.length === 0 ? null : (
			<ul className="button-group filters">
				{filters.map(this.renderFilterLink)}
			</ul>
		);
	},


	renderFilterLink: function(filter) {
		var {name, path} = filter;

		var propsFilter = this.props.filter;

		var isActive = propsFilter.path === filter.path || propsFilter.name === filter.name; // this.props.filtername.toLowerCase() === name.toLowerCase();

		return (
			<li key={name} className={isActive ? 'active' : null}>
				<Link className="tiny button" href={'/' + path}>
					<span className="filtername">{name}</span>
					{' '/*preserves the space between spans*/}
					<span className="count">{this.getItemCount(filter)}</span>
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
		return selectedFilter ? {
			filter: selectedFilter,
			list: list.filter(selectedFilter.filter)
		} :
		{
			filter: null,
			list: list
		};
	},

	render: function() {

		var {filter, list} = this.filter(this.props.list);

		return (
			<div>
				<FilterBar {...this.props}/>
				{list.length === 0 ? <NoMatches /> : null}
				<div>
					{cloneWithProps(this.props.listcomp, { list: list, filter:filter, omittitle: true	})}
				</div>
			</div>
		);
	}
});


var DefaultPath = React.createClass({
	mixins: [Router.NavigatableMixin],

	_navigateToDefaultFilter: function() {
		var path = this._defaultFilterPath();
		if (path) {
			this.navigate('/' + path, {replace: true});
		}
	},

	_findFilter: function(name) {
		return this.props.filters.find(f => (f.name === name));
	},

	/**
	 *	Returns the path of the first filter that doesn't result in an emtpy list,
	 *	or the first filter if all result in empty lists,
	 *	or null if this.props.filters.length === 0
	 */
	_defaultFilterPath: function() {
		if (this.props.defaultFilter) {
			var dfp = this.props.defaultFilter;
			var df = (typeof dfp === 'string') ? this._findFilter(dfp) : dfp;
			return (df||{}).path;
		}
		var filters = this.props.filters||[];
		var result = filters.length > 0 ? filters[0].path : null;
		filters.some(function(filter) {
			if (this.props.list.filter(filter.filter).length > 0) {
				result = filter.path || filter.name.toLowerCase();
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
		children: React.PropTypes.element.isRequired,

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
		filters: React.PropTypes.array
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

		if(!filters || filters.length === 0) {
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
			var filter = filters[filtername];
			var filterpath = filter.path || filtername.toLowerCase();
			return (
				<Location
					key={filterpath}
					path={filterpath}
					filter={filter}
					filtername={filtername}
					filterpath={filterpath}
					handler={FilterableView}
					contextProvider={this.props.contextProvider}
					list={list}
					listcomp={cloneWithProps(listComp, {list: list})}
					filters={filters}
					title={title}
				/>
			);
		}.bind(this));

		routes.push(
			<DefaultRoute
				key="default"
				handler={DefaultPath}
				filters={this.props.filters}
				list={list}
				defaultFilter={this.props.defaultFilter}
				/>
			);

		// optional route handler mounted after the filter segment in the url: collection/filter/child/
		if (this.props.childHandler) {
			var path = '/:filterpath/:'.concat(this.props.childPropName||'child', '/*');
			routes.push(
				<Location
					path={path}
					key="default"
					handler={this.props.childHandler}
					contextProvider={this.props.childContextProvider||this.props.contextProvider}
					filters={this.props.filters}
					list={list}
					defaultFilter={this.props.defaultFilter}
					/>
				);	
		}

		return routes;
	},

});


module.exports = Filter;
