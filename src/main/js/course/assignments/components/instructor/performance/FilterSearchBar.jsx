import React from 'react';

import SearchSortStore from '../../../SearchSortStore';

import EnrollmentSelect from './EnrollmentSelect';
import ItemCategorySelect from './ItemCategorySelect';

export default React.createClass({
	displayName: 'SearchSortBar',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	onSortChange (value) {
		SearchSortStore.sort = value;
	},

	onSearchChange (event) {
		SearchSortStore.search = event.target.value;
	},

	render () {

		return (
			<div>
				<div className="search-sort-bar">
					<EnrollmentSelect />
					<ItemCategorySelect />
				</div>
				<div className="search-sort-bar">
					<input className="search"
						type="search"
						placeholder="Search Assignments"
						onChange={this.onSearchChange}
						defaultValue={SearchSortStore.search} />
				</div>
			</div>
		);
	}
});
