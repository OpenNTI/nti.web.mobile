import React from 'react';
import cx from 'classnames';

import {DateTime} from 'nti-web-commons';

export default React.createClass({
	displayName: 'performance:ColumnCompleted',

	statics: {
		label () {
			return 'Completed';
		},
		className: 'col-completed',
		sort: 'completed'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		const {item} = this.props;
		const completedTime = item && item.completed;
		const classes = cx({
			'complete': !!completedTime,
			'late': item.dueDate && completedTime && completedTime > item.dueDate
		});
		return (
			<div className={classes}>
				{completedTime && <DateTime date={completedTime} format="MM/DD" />}
			</div>
		);
	}
});
