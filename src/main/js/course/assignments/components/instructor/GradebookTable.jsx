import React from 'react';
import cx from 'classnames';

import {SORT_ASC, SORT_DESC} from '../../GradebookConstants';
import {setSort} from '../../GradebookActions';
import Store from '../../GradebookStore';

import Student from './gradebook-table/ColumnStudent';
import Completed from './gradebook-table/ColumnCompleted';
import Score from './gradebook-table/ColumnScore';

const COLUMNS = [Student, Completed, Score];

export default React.createClass({
	displayName: 'GradebookTable',

	propTypes: {
		items: React.PropTypes.any.isRequired // iterable of UserGradeBookSummary objects
	},

	setSort (sort) {
		setSort(sort);
	},

	row (item) {
		return (
			<div className="gradebook-row" key={item.username}>
				{COLUMNS.map(Col =>
					<div className={Col.className} key={Col.label()}>
						<Col item={item}/>
					</div>
				)}
			</div>
		);
	},

	render () {

		const {items} = this.props;
		const {sort, sortOrder} = Store;

		return (
			<div className="gradebook">
				<div className="gradebook-row headings">
					{
						COLUMNS.map(Col => {
							const isSortCol = (sort === Col.sort);
							const classes = cx(
								'heading',
								{
									'sorted': isSortCol,
									'asc': isSortCol && sortOrder === SORT_ASC,
									'desc': isSortCol && sortOrder === SORT_DESC
								}
							);
							return (
								<div
									key={Col.label()}
									onClick={this.setSort.bind(this, Col.sort)}
									className={cx('column-heading', Col.className)}>
										<span className={classes}>{Col.label()}</span>
										<span className="sort-arrow" />
								</div>
							);
						})
					}
				</div>
				{items.map((item) => this.row(item))}
			</div>

		);
	}
});
