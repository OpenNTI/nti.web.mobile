import React from 'react';

import PageControls from '../PageControls';

import EnrollmentSelect from './EnrollmentSelect';
import CategorySelect from './CategorySelect';

export default React.createClass({
	displayName: 'SearchSortBar',

	propTypes: {
		summary: React.PropTypes.object.isRequired // GradeBookSummary object
	},

	onSearchChange (event) {
		const {summary} = this.props;
		summary.setSearch(event.target.value);
	},

	onEnrollmentChange (value) {
		const {summary} = this.props;
		console.debug(value);
		summary.setScopeFilter(value);
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
						<EnrollmentSelect onChange={this.onEnrollmentChange} value={summary.scopeFilter} />
						<CategorySelect onChange={this.onCategoryChange} value={summary.categoryFilter}/>
					</div>
					<div className="search-sort-bar">
						<PageControls
							currentPage={summary.getCurrentPage()}
							pageSize={summary.getPageSize()}
							total={summary.getTotal()}
							onChange={this.onPageChange}
						/>
						<input className="search"
							type="search"
							placeholder="Search Students"
							onChange={this.onSearchChange}
							defaultValue={summary.getSearch()} />
					</div>
				</div>
			</div>
		);
	}
});
