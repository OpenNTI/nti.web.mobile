import React from 'react';

import FilterBar from './FilterBar';
import NoMatches from './NoMatches';


export default React.createClass({
	displayName: 'FilterableView',

	propTypes: {
		filtername: React.PropTypes.string,
		filters: React.PropTypes.array,
		list: React.PropTypes.object,
		listcomp: React.PropTypes.node
	},

	/**
	 * filter the list according using the currently selected filter.
	 * @param {object} list Any object that implements filter.
	 * @return {object} The result of calling filter on the `list`
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
		} : {
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
					{React.cloneElement(this.props.listcomp, {list, filter, omittitle: true})}
				</div>
			</div>
		);
	}
});
