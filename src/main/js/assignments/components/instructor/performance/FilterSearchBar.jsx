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
		summary: React.PropTypes.object.isRequired // GradeBookSummary object
	},

	synchronizeFromStore () {
		this.forceUpdate();
	},

	onSearchChange (event) {
		const {summary} = this.props;
		summary.setSearch(event.target.value);
	},

	onEnrollmentChange (value) {
		const {summary} = this.props;
		console.debug(value);
		summary.setTypeFilter(value);
	},

	onCategoryChange (value) {
		const {summary} = this.props;
		summary.setCategoryFilter(value);
	},

	onPageChange (value)  {
		const {summary} = this.props;
		summary.setPage(value);
	},

	render () {

		const {summary} = this.props;

		return (
			<div>
				<div className="gradebook-assignment-header">
					<div className="search-sort-bar">
						<EnrollmentSelect onChange={this.onEnrollmentChange} value={summary.typeFilter} />
						<ItemCategorySelect onChange={this.onCategoryChange} value={summary.categoryFilter}/>
					</div>
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
