import React from 'react';

import StoreEvents from 'common/mixins/StoreEvents';

import Store from '../../../PerformanceStore';
import * as Actions from '../../../PerformanceActions';

import PageControls from '../PageControls';

import EnrollmentSelect from './EnrollmentSelect';
import ItemCategorySelect from './ItemCategorySelect';

export default React.createClass({
	displayName: 'SearchSortBar',

	mixins: [StoreEvents],

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	synchronizeFromStore () {
		this.forceUpdate();
	},

	onSearchChange (event) {
		Actions.setSearch(event.target.value);
	},

	onEnrollmentChange (value) {
		console.debug(value);
		Actions.setEnrollmentType(value);
	},

	onCategoryChange (value) {
		console.debug(value);
		Actions.setCategory(value);
	},

	onPageChange (value)  {
		Actions.setPage(value);
	},

	render () {

		return (
			<div>
				<div className="search-sort-bar">
					<EnrollmentSelect onChange={this.onEnrollmentChange} />
					<ItemCategorySelect onChange={this.onCategoryChange}/>
				</div>
				<div className="gradebook-assignment-header">
					<div className="search-sort-bar">
						<PageControls currentPage={Store.page} pageSize={10} total={100} onChange={this.onPageChange}/>
						<input className="search"
							type="search"
							placeholder="Search Students"
							onChange={this.onSearchChange}
							defaultValue={Store.search} />
					</div>
				</div>
			</div>
		);
	}
});
