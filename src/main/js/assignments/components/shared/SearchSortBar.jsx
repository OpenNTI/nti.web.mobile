import React from 'react';

import BufferedInput from 'common/components/BufferedInput';

import AssignmentsAccessor from './AssignmentsAccessor';

import SortBox from './SortBox';

export default React.createClass({
	displayName: 'SearchSortBar',
	mixins: [AssignmentsAccessor],

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	onOrderChange (order) {
		const store = this.getAssignments();
		if (store) {
			store.setOrder(order);
		}
	},


	onSearchChange (event) {
		const store = this.getAssignments();
		const {target: {value: search}} = event;

		if (store) {
			store.setSearch(search);
		}
	},


	render () {
		const {props: {assignments}} = this;
		const store = this.getAssignments();

		return (
			<div className="search-sort-bar">
				<SortBox assignments={assignments} onChange={this.onOrderChange} value={store.order}/>
				<BufferedInput className="search" delay={2000}
					type="search"
					placeholder="Search Assignments"
					onChange={this.onSearchChange}
					defaultValue={store.search} />
			</div>
		);
	}
});
