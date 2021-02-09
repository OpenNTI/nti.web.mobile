import './SummaryTable.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {SortOrder} from '@nti/lib-interfaces';
import {decorate} from '@nti/lib-commons';
import {Loading, HOC} from '@nti/web-commons';

import Table from '../gradebook-table/Table';
import ColumnStudentActionItems from '../gradebook-table/ColumnStudentActionItems';
import ColumnGrade from '../gradebook-table/ColumnGrade';
import {Provider as ShowAvatars} from '../../bindings/ShowAvatars';

class PerformanceSummaryTable extends React.Component {

	static propTypes = {
		summary: PropTypes.object.isRequired
	}


	static getItem = ({summary}) => summary


	onSort = (sort) => {
		const {summary} = this.props;
		const current = summary.getSort();
		const direction = current.sortOn === sort ? SortOrder.reverse(current.sortOrder) : SortOrder.ASC;
		summary.setSort(sort, direction);
	}


	render () {
		const {summary} = this.props;
		const columns = [ColumnStudentActionItems];
		const {sortOn, sortOrder} = summary.getSort();

		if (summary.loading) {
			return <Loading.Mask />;
		}

		if (summary.hasFinalGrade) {
			columns.push(ColumnGrade);
		}

		return (
			<Table
				className="summary-table"
				columns={columns}
				items={summary && summary.items}
				onSortChange={this.onSort}
				sort={sortOn}
				sortOrder={sortOrder}
			/>
		);
	}
}


export default decorate(PerformanceSummaryTable, [
	ShowAvatars.connect,
	HOC.ItemChanges.compose
]);
