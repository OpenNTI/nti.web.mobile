import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {SortOrder} from 'nti-lib-interfaces';

import ColumnHeading from './ColumnHeading';


export default class GradebookTableImpl extends React.Component {

	static propTypes = {
		className: PropTypes.string,
		items: PropTypes.any.isRequired,
		columns: PropTypes.array.isRequired,
		sort: PropTypes.string,
		sortOrder: PropTypes.any,
		onSortChange: PropTypes.func
	};

	setSort = (sort) => {
		const {onSortChange} = this.props;
		if (typeof onSortChange === 'function') {
			onSortChange(sort);
		}
	};

	onHeadingClick = (column) => {
		this.setSort(column.sort);
	};

	row = (item, index) => {
		const {columns} = this.props;
		return (
			<div className="gradebook-row" key={index}>
				{columns.map(Col =>
					(<div className={Col.className} key={Col.label()}>
						<Col item={item} {...this.props}/>
					</div>)
				)}
			</div>
		);
	};

	render () {

		const {className, columns, items, sort, sortOrder, ...otherProps} = this.props;

		delete otherProps.onSortChange;
		delete otherProps.assignment;
		delete otherProps.assignmentId;
		delete otherProps.userId;

		return (
			<div className={cx('gradebook', className)} {...otherProps}>
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
				{items.map((item, index) => this.row(item, index))}
			</div>

		);
	}
}
