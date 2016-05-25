import React from 'react';

import AcceptInvitation from 'invitations/components/Accept';
import {CollectionFilter as Filter} from 'nti-web-commons';

import filters from 'library/Filters';

import ListView from './ListView';


export default function CatalogListView (props) {
	return (
		<div className="catalog">
			<Filter {...props} filters={filters} localStorageKey="catalog">
				<ListView title={props.title} />
			</Filter>
			<AcceptInvitation />
		</div>
	);
}

CatalogListView.propTypes = {
	title: React.PropTypes.string
};
