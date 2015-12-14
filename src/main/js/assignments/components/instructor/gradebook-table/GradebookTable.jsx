import React from 'react';

import {setSort} from '../../../GradebookActions';
import Store from '../../../GradebookStore';

import Table from './Table';
import Student from './ColumnStudent';
import Completed from './ColumnCompleted';
import Score from './ColumnScore';
import Feedback from './ColumnFeedback';
import Actions from './ColumnActions';

const COLUMNS = [Student, Completed, Score, Feedback, Actions];

export default React.createClass({
	displayName: 'GradebookTable',

	propTypes: {
		items: React.PropTypes.any.isRequired, // iterable of UserGradeBookSummary objects
		assignment: React.PropTypes.object.isRequired
	},

	setSort (sort) {
		setSort(sort);
	},

	render () {

		const {items, assignment} = this.props;
		const {sort, sortOrder} = Store;

		return (
			<Table items={items}
				sort={sort}
				sortOrder={sortOrder}
				onSortChange={this.setSort}
				columns={COLUMNS}
				assignment={assignment}
				assignmentId={assignment.getID()}
			/>
		);
	}
});
