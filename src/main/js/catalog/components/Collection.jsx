import React from 'react';
import PropTypes from 'prop-types';
import {CollectionFilter as Filter} from 'nti-web-commons';

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
	title: PropTypes.string,

	/**
	 *	An array or object with a filter() method.
	 */
	list: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.shape({
			filter: PropTypes.func //shouldn't this be 'map' ?
		})
	]).isRequired,

	filters: PropTypes.object
};
