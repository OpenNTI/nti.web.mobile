import React from 'react';
import PropTypes from 'prop-types';
import {SortOrder} from 'nti-lib-interfaces';

import AssignmentSummary from '../../bindings/AssignmentSummary';

import Table from './Table';
import Student from './ColumnStudent';
import Completed from './ColumnCompleted';
import Score from './ColumnScore';
import Feedback from './ColumnFeedback';
import Actions from './ColumnActions';

const COLUMNS = [Student, Completed, Score, Feedback, Actions];

export default
@AssignmentSummary.connect
class GradebookTable extends React.Component {

	static propTypes = {
		assignment: PropTypes.object,
		store: PropTypes.object
	}

	setSort = (sort) => {
		const {store} = this.props;
		const current = store.getSort();
		const direction = current.sortOn === sort ? SortOrder.reverse(current.sortOrder) : SortOrder.ASC;

		store.setSort(sort, direction);
	}

	render () {
		const {assignment, store} = this.props;

		const {sortOn, sortOrder} = store.getSort();

		return (
			<Table
				id="gradebook-table"
				items={store}
				sort={sortOn}
				sortOrder={sortOrder}
				onSortChange={this.setSort}
				columns={COLUMNS}
				assignment={assignment}
				assignmentId={assignment.getID()}
			/>
		);
	}
}
