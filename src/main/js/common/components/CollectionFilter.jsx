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
		var filterLinks = Object.keys(this.props.filters||{}).map(function(filtername,index,array) {
			var isActive = this.props.filtername === filtername.toLowerCase();
			return (<li key={filtername} className={isActive ? 'active' : null}>
						<Link className="tiny button" href={'/' + filtername.toLowerCase()}><span className="filtername">{filtername}</span> {this.count(filtername)}</Link>
						</li>)
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

		var listComponent = React.addons.cloneWithProps(this.props.listcomp, {
			list: this.filter(this.props.list),
			omittitle: true
		});

		return (
			<div>
				{this.transferPropsTo(<FilterBar />)}
				<div>{listComponent}</div>
			</div>
		);
	}
});


var DefaultPath = React.createClass({
	mixins: [Router.NavigatableMixin],

	_navigateToFirstFilter: function() {
		var filterNames = Object.keys(this.props.filters||{});
		if (filterNames.length > 0) {
			var first = filterNames[0].toLowerCase();
			this.navigate('/' + first, {replace: true});
		}
	},

	componentDidUpdate: function() {
		if(this.getPath() === '/') {
			this._navigateToFirstFilter();	
		}
	},

	componentDidMount: function() {
		if(this.getPath() === '/') {
			this._navigateToFirstFilter();	
		}
	},

	render: function() {
		return this.props.listcomp;
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

	render: function() {

		var listView = React.addons.cloneWithProps(this.props.children, {
			list: this.props.list
		});

		var list = this.props.list;
		var filters = this.props.filters;
		var title = this.props.title;

		return (
			<Locations contextual>
				<Location path='/:filtername' handler={FilterableView} list={list} listcomp={listView} filters={filters} title={title} />
				<DefaultRoute handler={DefaultPath} filters={filters} listcomp={listView} title={title} />
			</Locations>
		);
	}

});

module.exports = Filter;
