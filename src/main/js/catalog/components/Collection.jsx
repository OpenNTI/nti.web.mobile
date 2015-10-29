import React from 'react';

import Filter from 'common/components/CollectionFilter';

import filters from 'library/Filters';

import ListView from './ListView';


export default React.createClass({
	displayName: 'Catalog:Collection',

	propTypes: {
		title: React.PropTypes.string,

		/**
		 *	An array or object with a filter() method.
		 */
		list: React.PropTypes.oneOfType([
			React.PropTypes.array,
			React.PropTypes.shape({
				filter: React.PropTypes.func //shouldn't this be 'map' ?
			})
		]).isRequired,

		filters: React.PropTypes.object
	},

	render () {
		return (
			<div className="catalog">
				<Filter {...this.props} filters={filters} localStorageKey="catalog">
					<ListView title={this.props.title} />
				</Filter>
			</div>
		);
	}
});
