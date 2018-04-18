import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {encodeForURI} from '@nti/lib-ntiids';
import {DateTime, HOC} from '@nti/web-commons';

const DATE_FORMAT = 'MM/DD';

export default
@HOC.ItemChanges.compose
class PerformanceItem extends React.Component {

	static propTypes = {
		item: PropTypes.object.isRequired,
		sortedOn: PropTypes.string
	}

	render () {

		const {props: {item, sortedOn}} = this;
		const {completed, grade} = item;

		const completedClasses = cx('completed', {
			'yes': completed,
			'no': !completed,
			'icon-check': completed,
			'sorted': sortedOn === 'completed'
		});

		const score = grade && grade.value;

		return (
			<div className="performance-item">
				<div className={completedClasses}/>
				<a href={`./${encodeForURI(item.assignmentId)}/`}>
					<div className={cx('assignment-title', {'sorted': sortedOn === 'title'})}>{item.title}</div>
				</a>
				<div className={cx('assigned', {'sorted': sortedOn === 'assignedDate'})}>
					<DateTime format={DATE_FORMAT} date={item.assignedDate} />
				</div>
				<div className={cx('due', {'sorted': sortedOn === 'dueDate'})}>
					<DateTime format={DATE_FORMAT} date={item.dueDate} />
				</div>
				<div className={cx('score', {'sorted': sortedOn === 'grade'})}>{score}</div>
			</div>
		);
	}
}
