import React from 'react';

import {SortOrder} from 'nti-lib-interfaces';

import Accessor from '../mixins/AssignmentSummaryAccessor';

import Table from './Table';
import Student from './ColumnStudent';
import Completed from './ColumnCompleted';
import Score from './ColumnScore';
import Feedback from './ColumnFeedback';
import Actions from './ColumnActions';

const COLUMNS = [Student, Completed, Score, Feedback, Actions];

export default React.createClass({
	displayName: 'GradebookTable',
	mixins: [Accessor],

	setSort (sort) {
		const store = this.getStore();
		const current = store.getSort();
		const direction = current.sortOn === sort ? SortOrder.reverse(current.sortOrder) : SortOrder.ASC;

		store.setSort(sort, direction);
	},

	render () {
		const assignment = this.getAssignment();
		const store = this.getStore();

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
});
