import React from 'react';
import PropTypes from 'prop-types';
import {BufferedInput, HOC} from '@nti/web-commons';

import PageControls from '../PageControls';

import EnrollmentSelect from './EnrollmentSelect';
import CategorySelect from './CategorySelect';

export default
@HOC.ItemChanges.compose
class SearchSortBar extends React.Component {

	static propTypes = {
		summary: PropTypes.object.isRequired // GradeBookSummary object
	}

	static getItem = ({summary}) => summary //Item that changes

	getStore (props = this.props) {
		return props.summary;
	}

	onSearchChange = (event) => {
		this.getStore().setSearch(event.target.value);
	}

	onEnrollmentChange = (value) => {
		this.getStore().setScopeFilter(value);
	}

	onCategoryChange = (value) => {
		this.getStore().setCategoryFilter(value);
	}

	onPageChange = (value) => {
		this.getStore().loadPage(value);
	}

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
}
