import React from 'react';
import DateTime from 'common/components/DateTime';
import cx from 'classnames';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const DATE_FORMAT = 'MM/DD';

export default React.createClass({
	displayName: 'PerformanceItem',

	propTypes: {
		assignment: React.PropTypes.object.isRequired,
		sortedOn: React.PropTypes.string
	},

	render () {

		let {assignment, sortedOn} = this.props;
		let completed = assignment.hasLink('History');
		let score = '';

		let completedClasses = cx('completed', {
			'yes': completed,
			'no': !completed,
			'icon-check': completed,
			'sorted': sortedOn === 'completed'
		});

		return (
			<div className="performance-item">
				<div className={completedClasses}></div>
				<a href={`../${encodeForURI(assignment.getID())}/`}>
					<div className={cx('assignment-title', {'sorted': sortedOn === 'title'})}>{assignment.title}</div>
				</a>
				<div className={cx('assigned', {'sorted': sortedOn === 'available_for_submission_beginning'})}>
					<DateTime format={DATE_FORMAT} date={assignment.available_for_submission_beginning} />
				</div>
				<div className={cx('due', {'sorted': sortedOn === 'available_for_submission_ending'})}>
					<DateTime format={DATE_FORMAT} date={assignment.available_for_submission_ending} />
				</div>
				<div className={cx('score', {'sorted': sortedOn === 'score'})}>{score}</div>
			</div>
		);
	}
});
