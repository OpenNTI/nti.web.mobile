import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from 'nti-web-commons';

import AssignmentSummary from '../bindings/AssignmentSummary';

import FilterMenu from './FilterMenu';
import PageControls from './PageControls';
import OptionsMenu from './OptionsMenu';

export default
@AssignmentSummary.connect
class InstructorAssignmentHeader extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		store: PropTypes.object,
	}

	setPage = (page) => {
		this.props.store.loadPage(page);
	}

	render () {
		const {assignment, store} = this.props;

		return (
			<div className="gradebook-assignment-header">
				<OptionsMenu {...this.props}/>
				<PageControls
					currentPage={store.getCurrentPage()}
					pageSize={store.getPageSize()}
					total={store.getTotal()}
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
}
