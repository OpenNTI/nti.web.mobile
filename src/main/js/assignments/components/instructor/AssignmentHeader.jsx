import React from 'react';

import DateTime from 'common/components/DateTime';

import Store from '../../GradebookStore';
import {setPage} from '../../GradebookActions';

import FilterMenu from './FilterMenu';
import PageControls from './PageControls';
import OptionsMenu from './OptionsMenu';

export default React.createClass({
	displayName: 'instructor:AssignmentHeader',

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	setPage (page) {
		setPage(page);
	},

	render () {

		const {assignment} = this.props;

		return (
			<div className="gradebook-assignment-header">
				<OptionsMenu />
				<PageControls
					currentPage={Store.page}
					pageSize={Store.batchSize}
					total={Store.total}
					onChange={this.setPage}
				/>
				<div className="gradebook-assignment-title">{assignment.title}</div>
				<div className="meta">
					<DateTime date={assignment.getDueDate()}/>
					<FilterMenu />
				</div>
				<div className="extras"><a href="../">View Assignment</a></div>
			</div>
		);
	}
});
