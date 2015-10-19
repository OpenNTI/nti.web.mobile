import React from 'react';

import SearchSortStore from '../SearchSortStore';

import SortBox from './SortBox';

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

		let {assignments} = this.props;

		return (
			<div className="search-sort-bar">
				<SortBox assignments={assignments} onChange={this.onSortChange} value={SearchSortStore.sort}/>
				<input className="search"
					type="search"
					placeholder="Search Assignments"
					onChange={this.onSearchChange}
					defaultValue={SearchSortStore.search} />
			</div>
		);
	}
});
