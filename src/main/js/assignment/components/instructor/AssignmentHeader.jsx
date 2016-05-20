import React from 'react';

import {DateTime} from 'nti-web-commons';

import Accessor from './mixins/AssignmentSummaryAccessor';

import FilterMenu from './FilterMenu';
import PageControls from './PageControls';
import OptionsMenu from './OptionsMenu';

export default React.createClass({
	displayName: 'instructor:AssignmentHeader',
	mixins: [Accessor],

	setPage (page) {
		this.getStore().loadPage(page);
	},

	render () {
		const assignment = this.getAssignment();
		const Store = this.getStore();

		return (
			<div className="gradebook-assignment-header">
				<OptionsMenu {...this.props}/>
				<PageControls
					currentPage={Store.getCurrentPage()}
					pageSize={Store.getPageSize()}
					total={Store.getTotal()}
					onChange={this.setPage}
				/>
				<div className="gradebook-assignment-title">{assignment.title}</div>
				<div className="meta">
					<DateTime date={assignment.getDueDate()}/>
					<FilterMenu {...this.props}/>
				</div>
				<div className="extras"><a href="../">View Assignment</a></div>
			</div>
		);
	}
});
