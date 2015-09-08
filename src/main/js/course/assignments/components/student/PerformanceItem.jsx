import React from 'react';
import DateTime from 'common/components/DateTime';
import cx from 'classnames';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const DATE_FORMAT = 'MM/DD';

export default React.createClass({
	displayName: 'PerformanceItem',

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	render () {

		let {assignment} = this.props;
		let completed = assignment.hasLink('History');
		let score = '';

		let completedClasses = cx('completed', {
			'yes': completed,
			'no': !completed,
			'icon-check': completed
		});

		return (
			<div className="performance-item">
				<a href={`../${encodeForURI(assignment.getID())}/`}><div className="assignment-title">{assignment.title}</div></a>
				<div className="assigned"><DateTime format={DATE_FORMAT} date={assignment.available_for_submission_beginning} /></div>
				<div className="due"><DateTime format={DATE_FORMAT} date={assignment.available_for_submission_ending} /></div>
				<div className={completedClasses}></div>
				<div className="score">{score}</div>
			</div>
		);
	}
});
