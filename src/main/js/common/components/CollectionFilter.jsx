/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

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

	_itemcount: function(filtername) {
		var filter = this.props.filters[filtername];
		if(filter && this.props.list.filter) {
			return this.props.list.filter(filter).length;
		}
		return 0;
	},

	count: function(filtername) {
		return (<span className="count">{this._itemcount(filtername)}</span>);
	},

	render: function() {
		var filterLinks = Object.keys(this.props.filters||{}).map(function(filtername) {
			var isActive = this.props.filtername === filtername.toLowerCase();
			return (
				<li key={filtername} className={isActive ? 'active' : null}>
					<Link className="tiny button" href={'/' + filtername.toLowerCase()}>
						<span className="filtername">{filtername}</span> {this.count(filtername)}</Link>
				</li>
			);
		}.bind(this));

		var filterBar = filterLinks.length === 0 ? null : (
			<ul className="button-group filters">
				{filterLinks}
			</ul>
		);

		return (
			<div className="grid-container">
				<h2>{this.props.title}</h2>
				{filterBar}
			</div>
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

		var listComponent = React.addons.cloneWithProps(this.props.listcomp, {
			list: filtered,
			omittitle: true
		});

		return (
			<div>
				{this.transferPropsTo(<FilterBar />)}
				{filtered.length === 0 ? <NoMatches /> : null}
				<div>{listComponent}</div>
			</div>
		);
	}
});


var DefaultPath = React.createClass({
	mixins: [Router.NavigatableMixin],

	_navigateToDefaultFilter: function() {
		var filterNames = Object.keys(this.props.filters||{});
		if (filterNames.length > 0) {
			var filter = this.props.defaultFilter || filterNames[0];
			this.navigate('/' + filter.toLowerCase(), {replace: true});
		}
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

		var listView = React.addons.cloneWithProps(this.props.children, {
			list: this.props.list
		});

		var list = this.props.list;
		var filters = this.props.filters;
		var title = this.props.title;

		if(!filters || Object.keys(filters).length === 0) {
			//console.debug('No filters. Returning list view.');
			return listView;
		}
		var routes = Object.keys(filters).map(function(filtername) {
			var filterpath = filtername.toLowerCase();
			return Location({
				path: '/' + filterpath,
				filtername: filterpath,
				handler: FilterableView,
				list: list,
				listcomp: listView,
				filters: filters,
				title: title
			});
		});

		routes.push(<DefaultRoute handler={DefaultPath} filters={this.props.filters} defaultFilter={this.props.defaultFilter}/>);

		return (
			<Locations contextual>
				{routes}
			</Locations>
		);
	}

});


module.exports = Filter;
