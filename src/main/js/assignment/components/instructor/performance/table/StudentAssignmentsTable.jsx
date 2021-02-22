import './StudentAssignmentsTable.scss';
import PropTypes from 'prop-types';
import React from 'react';
import { SortOrder } from '@nti/lib-interfaces';

import Table from '../../gradebook-table/Table';
import ColumnActions from '../../gradebook-table/ColumnActions';

import ColumnAssignment from './ColumnAssignment';
import ColumnCompleted from './ColumnCompleted';
import ColumnScore from './ColumnScore';
import ColumnFeedback from './ColumnFeedback';

const COLUMNS = [
	ColumnAssignment,
	ColumnCompleted,
	ColumnScore,
	ColumnFeedback,
	ColumnActions,
];

export default class extends React.Component {
	static displayName = 'StudentAssignmentsTable';

	static propTypes = {
		items: PropTypes.any.isRequired,
	};

	componentDidMount() {
		const { items } = this.props;
		items.addListener('change', this.itemsChange);
	}

	componentWillUnmount() {
		const { items } = this.props;
		items.removeListener('change', this.itemsChange);
	}

	itemsChange = () => {
		this.forceUpdate();
	};

	sortChange = sort => {
		const { items } = this.props;
		const current = items.getSort();
		const direction =
			current.sortOn === sort
				? SortOrder.reverse(current.sortOrder)
				: SortOrder.ASC;
		items.setSort(sort, direction);
	};

	render() {
		const { items } = this.props;
		const sort = items.getSort();
		return (
			<Table
				{...this.props}
				className="student-assignments-table"
				columns={COLUMNS}
				sort={sort.sortOn}
				sortOrder={sort.sortOrder}
				onSortChange={this.sortChange}
			/>
		);
	}
}
