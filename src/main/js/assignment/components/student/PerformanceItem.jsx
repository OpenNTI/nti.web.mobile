import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti-lib-ntiids';

import {DateTime, Mixins} from 'nti-web-commons';

const DATE_FORMAT = 'MM/DD';

export default React.createClass({
	displayName: 'PerformanceItem',
	mixins: [Mixins.ItemChanges],

	propTypes: {
		item: React.PropTypes.object.isRequired,
		sortedOn: React.PropTypes.string
	},


	getInitialState () {
		return {};
	},


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
				<div className={completedClasses}></div>
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
});
