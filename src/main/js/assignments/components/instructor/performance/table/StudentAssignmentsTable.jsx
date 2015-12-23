import React from 'react';

import Table from '../../gradebook-table/Table';

import ColumnAssignment from './ColumnAssignment';
import ColumnCompleted from './ColumnCompleted';
import ColumnScore from './ColumnScore';
import ColumnFeedback from './ColumnFeedback';

const COLUMNS = [ColumnAssignment, ColumnCompleted, ColumnScore, ColumnFeedback];

export default React.createClass({
	displayName: 'StudentAssignmentsTable',

	propTypes: {
		items: React.PropTypes.any.isRequired
	},

	componentWillMount () {
		const {items} = this.props;
		items.addListener('change', this.itemsChange);
	},

	componentWillUnmount () {
		const {items} = this.props;
		items.removeListener('change', this.itemsChange);
	},

	itemsChange () {
		this.forceUpdate();
	},

	sortChange (sort) {
		const reverse = (dir) => dir === 'ascending' ? 'descending' : 'ascending';
		const {items} = this.props;
		const currentSort = items.getSort();
		const direction = currentSort.sortOn === sort ? reverse(currentSort.sortOrder) : 'ascending';
		items.setSort(sort, direction);
	},

	render () {
		const {items} = this.props;
		const sort = items.getSort();
		return (
			<Table id="student-assignments-table" {...this.props}
				columns={COLUMNS}
				sort={sort.sortOn}
				sortOrder={sort.sortOrder}
				onSortChange={this.sortChange}
				/>
		);
	}
});
