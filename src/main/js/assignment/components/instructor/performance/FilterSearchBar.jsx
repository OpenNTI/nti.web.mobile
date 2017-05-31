import React from 'react';

import createReactClass from 'create-react-class';

import {BufferedInput, Mixins} from 'nti-web-commons';

import PageControls from '../PageControls';

import EnrollmentSelect from './EnrollmentSelect';
import CategorySelect from './CategorySelect';

export default createReactClass({
	displayName: 'SearchSortBar',
	mixins: [Mixins.ItemChanges],

	propTypes: {
		summary: React.PropTypes.object.isRequired // GradeBookSummary object
	},


	getItem () { return this.props.summary; },


	onSearchChange (event) {
		this.getItem().setSearch(event.target.value);
	},

	onEnrollmentChange (value) {
		this.getItem().setScopeFilter(value);
	},

	onCategoryChange (value) {
		this.getItem().setCategoryFilter(value);
	},

	onPageChange (value)  {
		this.getItem().loadPage(value);
	},

	render () {

		const {summary} = this.props;

		return summary && (
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
				<BufferedInput
					className="search"
					type="search"
					placeholder="Search Students"
					onChange={this.onSearchChange}
					delay={1000}
					defaultValue={summary.getSearch()} />
				</div>
			</div>
		);
	}
});
