import React from 'react';
import cx from 'classnames';

import {SortOrder} from 'nti.lib.interfaces';

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

		const {columns, items, sort, sortOrder} = this.props;

		return (
			<div className="gradebook" {...this.props}>
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
								<div
									key={Col.label()}
									onClick={()=> this.setSort(Col.sort)}
									className={classes}>
										<span className="heading">{Col.label()}</span>
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
