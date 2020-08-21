import './SearchSortBar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {BufferedInput} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import AssignmentGroups from '../bindings/AssignmentGroups';

import SortBox from './SortBox';

const t = scoped('nti-web-mobile.assignment.component.shared.SearchSortBar', {
	placeholder: 'Search Assignments'
});

export default
@AssignmentGroups.connect
class SearchSortBar extends React.Component {
	static propTypes = {
		store: PropTypes.object
	}


	onOrderChange = (order) => {
		const {store} = this.props;
		if (store) {
			store.setOrder(order);
		}
	}


	onSearchChange = (event) => {
		const {store} = this.props;
		const {target: {value: search}} = event;

		if (store) {
			store.setSearch(search);
		}
	}


	render () {
		const {store} = this.props;

		return (
			<div className="search-sort-bar">
				<SortBox onChange={this.onOrderChange} value={store.order}/>
				<BufferedInput className="search" delay={2000}
					type="search"
					placeholder={t('placeholder')}
					onChange={this.onSearchChange}
					defaultValue={store.search} />
			</div>
		);
	}
}
