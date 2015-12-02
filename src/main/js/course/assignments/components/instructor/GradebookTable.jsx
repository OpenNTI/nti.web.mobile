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

		return (
			<div className="gradebook">
				<div className="gradebook-row headings">
					{COLUMNS.map(Col =>
						<div key={Col.label()} className="column-heading">{Col.label()}</div>
					)}
				</div>
				{items.map((item) => this.row(item))}
			</div>

		);
	}
});
