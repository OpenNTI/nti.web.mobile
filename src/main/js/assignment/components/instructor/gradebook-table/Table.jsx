import React from 'react';
import cx from 'classnames';

import ColumnHeading from './ColumnHeading';

import {SortOrder} from 'nti-lib-interfaces';

export default React.createClass({
	displayName: 'gradebook:Table',

	propTypes: {
		items: React.PropTypes.any.isRequired,
		columns: React.PropTypes.array.isRequired,
		sort: React.PropTypes.string,
		sortOrder: React.PropTypes.any,
		onSortChange: React.PropTypes.func
	},

	setSort (sort) {
		const {onSortChange} = this.props;
		if (typeof onSortChange === 'function') {
			onSortChange(sort);
		}
	},

	onHeadingClick (column) {
		this.setSort(column.sort);
	},

	row (item) {
		const {columns} = this.props;
		return (
			<div className="gradebook-row" key={item.title || item.username}>
				{columns.map(Col =>
					<div className={Col.className} key={Col.label()}>
						<Col item={item} {...this.props}/>
					</div>
				)}
			</div>
		);
	},

	render () {

		const {columns, items, sort, sortOrder, ...otherProps} = this.props;

		delete otherProps.onSortChange;
		delete otherProps.assignment;
		delete otherProps.assignmentId;
		delete otherProps.userId;

		return (
			<div className="gradebook" {...otherProps}>
				<div className="gradebook-row headings">
					{
						columns.map(Col => {
							const isSortCol = (sort === Col.sort);
							const classes = cx(
								'column-heading',
								Col.className,
								{
									'sorted': isSortCol,
									'asc': isSortCol && sortOrder === SortOrder.ASC,
									'desc': isSortCol && sortOrder === SortOrder.DESC
								}
							);
							return (
								<ColumnHeading
									key={Col.label()}
									column={Col}
									className={classes}
									onClick={this.onHeadingClick}
								/>
							);
						})
					}
				</div>
				{items.map((item) => this.row(item))}
			</div>

		);
	}
});
