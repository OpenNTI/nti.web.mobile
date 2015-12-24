import React from 'react';

import Loading from 'common/components/Loading';

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
		const reverse = (dir) => dir === 'ascending' ? 'descending' : 'ascending';
		const {summary} = this.props;
		const currentSort = summary.getSort();
		const direction = currentSort.sortOn === sort ? reverse(currentSort.sortOrder) : 'ascending';
		summary.setSort(sort, direction);
	},

	render () {
		const {summary} = this.props;
		const columns = [ColumnStudentActionItems, ColumnGrade];
		const {sortOn, sortOrder} = summary.getSort();
		if (summary.loading) {
			return <Loading />;
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
