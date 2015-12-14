import React from 'react';

import Loading from 'common/components/Loading';

import Table from '../gradebook-table/Table';
import ColumnStudent from '../gradebook-table/ColumnStudent';
import ColumnScore from '../gradebook-table/ColumnScore';

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
		console.debug('sort!', sort);
		summary.setSort(sort);
	},

	render () {
		const {summary} = this.props;
		const columns = [ColumnStudent, ColumnScore];

		if (summary.loading) {
			return <Loading />;
		}
		return (
			<Table columns={columns} items={summary && summary.items} onSortChange={this.onSort} />
		);
	}
});
