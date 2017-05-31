import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import {DateTime} from 'nti-web-commons';

export default class extends React.Component {
	static displayName = 'performance:ColumnCompleted';

	static label () {
		return 'Completed';
	}

	static className = 'col-completed';
	static sort = 'completed';

	static propTypes = {
		item: PropTypes.object.isRequired
	};

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
}
