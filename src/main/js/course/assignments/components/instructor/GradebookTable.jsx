import React from 'react';

import Student from './gradebook-table/ColumnStudent';
import Completed from './gradebook-table/ColumnCompleted';
import Score from './gradebook-table/ColumnScore';

const COLUMNS = [Student, Completed, Score];

export default React.createClass({
	displayName: 'GradebookTable',

	propTypes: {
		items: React.PropTypes.any.isRequired // iterable of UserGradeBookSummary objects
	},

	row (item) {
		return (
			<tr key={item.username}>
				{COLUMNS.map(Col =>
					<td className={Col.className} key={Col.label()}>
						<Col item={item}/>
					</td>
				)}
			</tr>
		);
	},

	render () {

		const {items} = this.props;

		return (
			<table className="gradebook-table">
				<thead>
					<tr>
						{COLUMNS.map(Col =>
							<th key={Col.label()}><div className="column-heading">{Col.label()}</div></th>
						)}
					</tr>
				</thead>
				<tbody>
					{items.map((item) => this.row(item))}
				</tbody>
			</table>

		);
	}
});
