import React from 'react';

import {getEnvironment} from 'react-router-component/lib/environment/LocalStorageKeyEnvironment';
import {Locations, Location, NotFound as DefaultRoute} from 'react-router-component';

import FilterableView from './FilterableView';

import DefaultPath from './DefaultPath';

export default React.createClass({
	displayName: 'Filter',

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
		filters: React.PropTypes.array,


		title: React.PropTypes.string,


		defaultFilter: React.PropTypes.string,


		localStorageKey: React.PropTypes.string
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
		let {children, list, filters} = this.props;

		if (!env) { return; }

		if(!filters || filters.length === 0) {
			//console.debug('No filters. Returning list view.');
			return React.cloneElement(children, {list: list});
		}

		return (
			<Locations environment={env}>
				{this.getRoutes()}
			</Locations>
		);
	},


	getRoutes () {
		let {children, defaultFilter, list, filters, title} = this.props;
		let listComp = children;


		let routes = Object.keys(filters).map(filtername => {
			let filter = filters[filtername];
			let filterpath = filter.kind || filtername.toLowerCase();
			return (
				<Location
					key={filterpath}
					path={`/${filterpath}`}
					filter={filter}
					filtername={filtername}
					filterpath={filterpath}
					handler={FilterableView}

					list={list}
					listcomp={React.cloneElement(listComp, {list: list})}
					filters={filters}
					title={title}
				/>
			);
		});

		routes.push(
			<DefaultRoute
				key="default"
				handler={DefaultPath}
				filters={filters}
				list={list}
				defaultFilter={defaultFilter}
				/>
			);

		return routes;
	}

});
