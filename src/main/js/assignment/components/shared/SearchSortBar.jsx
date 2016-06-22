import React from 'react';

import {BufferedInput} from 'nti-web-commons';

import StoreAccessor from '../../mixins/AssignmentsListViewStoreAccessor';

import SortBox from './SortBox';

export default React.createClass({
	displayName: 'SearchSortBar',
	mixins: [StoreAccessor],


	onOrderChange (order) {
		const store = this.getStore();
		if (store) {
			store.setOrder(order);
		}
	},


	onSearchChange (event) {
		const store = this.getStore();
		const {target: {value: search}} = event;

		if (store) {
			store.setSearch(search);
		}
	},


	render () {
		const store = this.getStore();

		return (
			<div className="search-sort-bar">
				<SortBox onChange={this.onOrderChange} value={store.order}/>
				<BufferedInput className="search" delay={2000}
					type="search"
					placeholder="Search Assignments"
					onChange={this.onSearchChange}
					defaultValue={store.search} />
			</div>
		);
	}
});
