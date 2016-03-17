import React from 'react';

import Filter from 'common/components/CollectionFilter';

import filters from 'library/Filters';

import ListView from './ListView';

export default function CatalogCollection (props) {
	return (
		<div className="catalog">
			<Filter {...props} filters={filters} localStorageKey="catalog">
				<ListView title={props.title} />
			</Filter>
		</div>
	);
}

CatalogCollection.propTypes = {
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
};
