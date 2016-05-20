import React from 'react';

import {SortOrder} from 'nti-lib-interfaces';

import {Loading} from 'nti-web-commons';

import Table from '../gradebook-table/Table';
import ColumnStudentActionItems from '../gradebook-table/ColumnStudentActionItems';
import ColumnGrade from '../gradebook-table/ColumnGrade';

import ShowAvatars from '../mixins/ShowAvatarsContainer';

export default React.createClass({
	displayName: 'Performance:SummaryTable',

	mixins: [ShowAvatars],

	propTypes: {
		summary: React.PropTypes.object.isRequired
	},

	componentWillMount () {
		const {summary} = this.props;
		summary.addListener('change', this.storeChange);
	},

	componentWillUnmount () {
		const {summary} = this.props;
		summary.removeListener('change', this.storeChange);
	},

	storeChange () {
		this.forceUpdate();
	},

	onSort (sort) {
		const {summary} = this.props;
		const current = summary.getSort();
		const direction = current.sortOn === sort ? SortOrder.reverse(current.sortOrder) : SortOrder.ASC;
		summary.setSort(sort, direction);
	},

	render () {
		const {summary} = this.props;
		const columns = [ColumnStudentActionItems];
		const {sortOn, sortOrder} = summary.getSort();

		if (summary.loading) {
			return <Loading />;
		}

		if (summary.hasFinalGrade) {
			columns.push(ColumnGrade);
		}

		return (
			<Table id="summary-table"
				columns={columns}
				items={summary && summary.items}
				onSortChange={this.onSort}
				sort={sortOn}
				sortOrder={sortOrder}
				/>
		);
	}
});
