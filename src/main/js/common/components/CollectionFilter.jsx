import React from 'react';
import cloneWithProps from 'react/lib/cloneWithProps';

import Loading from 'common/components/Loading';
import {Locations, Location, Link, NavigatableMixin, NotFound as DefaultRoute} from 'react-router-component';
import {getEnvironment} from 'react-router-component/lib/environment/LocalStorageKeyEnvironment';

import NoMatches from './NoMatches';


let FilterBar = React.createClass({

	propTypes: {
		filters: React.PropTypes.array
	},


	getItemCount (filter) {
		if(filter && this.props.list.filter) {
			return this.props.list.filter(filter.filter).length;
		}
		return 0;
	},

	render () {
		return (
			<div className="grid-container">
				<h2>{this.props.title}</h2>
				{this.renderFilterBar()}
			</div>
		);
	},


	renderFilterBar  () {
		let filters = this.props.filters || [];
		return filters.length === 0 ? null : (
			<ul className="button-group filters">
				{filters.map(this.renderFilterLink)}
			</ul>
		);
	},


	renderFilterLink (filter) {
		let {name, path} = filter;

		let propsFilter = this.props.filter;

		let isActive = propsFilter.path === filter.path || propsFilter.name === filter.name; // this.props.filtername.toLowerCase() === name.toLowerCase();

		return (
			<li key={name} className={isActive ? 'active' : null}>
				<Link className="tiny button" href={`/${path}`}>
					<span className="filtername">{name}</span>
					{' '/*preserves the space between spans*/}
					<span className="count">{this.getItemCount(filter)}</span>
				</Link>
			</li>
		);
	}

});


let FilterableView = React.createClass({

	/**
	 * filter the list according using the currently selected filter.
	 */
	filter (list) {

		if (!(list && list.filter)) {
			console.error('List should be an array (or at least have a \'filter\' method. Returning an empty array. Received: %O', list);
			return [];
		}

		// default to the first filter
		let fkeys = Object.keys(this.props.filters);
		let fname = fkeys.length > 0 ? fkeys[0] : undefined;

		if (this.props.filtername) { // filter specified in the url, e.g. library/courses/archived
			for(let i = 0; i < fkeys.length; i++) {
				if (this.props.filtername === fkeys[i].toLowerCase()) {
					fname = fkeys[i];
					break;
				}
			}
		}

		let selectedFilter = this.props.filters[fname];
		return selectedFilter ? {
			filter: selectedFilter,
			list: list.filter(selectedFilter.filter)
		} :
		{
			filter: null,
			list: list
		};
	},

	render () {

		let {filter, list} = this.filter(this.props.list);

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


let DefaultPath = React.createClass({
	mixins: [NavigatableMixin],


	startRedirect() {
		clearTimeout(this.__pendingRedirect);
		this.__pendingRedirect = setTimeout(()=> this.performRedirect(), 1);
	},


	performRedirect () {
		let path = this.defaultFilterPath();
		if (path) {
			this.navigate(`/${path}`, {replace: true});
		}
	},


	findFilter (name) {
		return this.props.filters.find(f => f.name === name);
	},


	/**
	 *	Returns the path of the first filter that doesn't result in an emtpy list,
	 *	or the first filter if all result in empty lists,
	 *	or null if this.props.filters.length === 0
	 */
	defaultFilterPath () {
		if (this.props.defaultFilter) {
			let dfp = this.props.defaultFilter;
			let df = (typeof dfp === 'string') ? this.findFilter(dfp) : dfp;
			return (df||{}).path;
		}
		let filters = this.props.filters||[];
		let result = filters.length > 0 ? filters[0].path : null;

		filters.some(filter => {
			if (this.props.list.filter(filter.filter).length > 0) {
				result = filter.path || filter.name.toLowerCase();
				return true;
			}
			return false;
		});

		return result;
	},


	isDefaulted () {
		let filters = this.props.filters||[];
		let p = this.getPath() || '';

		let inSet = ()=> filters.reduce((x, f)=> x || (f.path === p), null);


		return /^.?null$/i.test(p) || !inSet(p);
	},


	componentDidUpdate () {
		if(this.isDefaulted()) {
			this.startRedirect();
		}
	},


	componentDidMount () {
		if(this.isDefaulted()) {
			this.startRedirect();
		}
	},


	render () {
		return (<Loading/>);
	}

});


let Filter = React.createClass({

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
		 * 		Odds (item,index,array) {
		 * 			return index % 2 === 1;
		 * 		},
		 * 		Evens (item,index,array) {
		 * 			return index % 2 === 0;
		 * 		}
		 *	}
		 */
		filters: React.PropTypes.array
	},


	getDefaultProps () {
		return {
			localStorageKey: null,
			list: [],
			filters: {}
		};
	},


	componentWillMount () {
		let key = this.props.localStorageKey;
		if (!key) {
			throw new Error('The "localStorageKey" is required.');
		}
		let env = getEnvironment(key);
		this.setState({env});
	},


	render () {
		let {env} = this.state || {};
		let {list, filters} = this.props;

		if (!env) {return;}

		if(!filters || filters.length === 0) {
			//console.debug('No filters. Returning list view.');
			return cloneWithProps(this.props.children, {list: list});
		}

		return (
			<Locations environment={env}>
				{this.getRoutes()}
			</Locations>
		);
	},


	getRoutes () {
		let {children, list, filters, title} = this.props;
		let listComp = children;


		let routes = Object.keys(filters).map(filtername => {
			let filter = filters[filtername];
			let filterpath = filter.path || filtername.toLowerCase();
			return (
				<Location
					key={filterpath}
					path={`/${filterpath}`}
					filter={filter}
					filtername={filtername}
					filterpath={filterpath}
					handler={FilterableView}

					list={list}
					listcomp={cloneWithProps(listComp, {list: list})}
					filters={filters}
					title={title}
				/>
			);
		});

		routes.push(
			<DefaultRoute
				key="default"
				handler={DefaultPath}
				filters={this.props.filters}
				list={list}
				defaultFilter={this.props.defaultFilter}
				/>
			);

		return routes;
	},

});


export default Filter;
