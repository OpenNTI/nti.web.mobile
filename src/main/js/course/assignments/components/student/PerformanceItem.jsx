import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {HISTORY_LINK} from 'nti.lib.interfaces/models/assessment/Constants';

import DateTime from 'common/components/DateTime';

const DATE_FORMAT = 'MM/DD';

export default React.createClass({
	displayName: 'PerformanceItem',

	propTypes: {
		assignment: React.PropTypes.object.isRequired,
		sortedOn: React.PropTypes.string
	},

	getInitialState () {
		return {
			score: ''
		};
	},

	componentWillMount () {
		this.loadScore(this.props.assignment);
	},

	loadScore (assignment) {
		if (!assignment) { return; }

		assignment.loadHistory(true)
			.then(history => {
				if(history) {
					this.setState({
						score: history.getGradeValue()
					});
				}
			})
			.catch(reason => {
				if(typeof reason === 'object') {
					console.error(reason);
				}
			});
	},

	render () {

		let {assignment, sortedOn} = this.props;
		let completed = assignment.hasLink(HISTORY_LINK);
		let {score} = this.state;

		let completedClasses = cx('completed', {
			'yes': completed,
			'no': !completed,
			'icon-check': completed,
			'sorted': sortedOn === 'completed'
		});

		return (
			<div className="performance-item">
				<div className={completedClasses}></div>
				<a href={`./${encodeForURI(assignment.getID())}/`}>
					<div className={cx('assignment-title', {'sorted': sortedOn === 'title'})}>{assignment.title}</div>
				</a>
				<div className={cx('assigned', {'sorted': sortedOn === 'assigned'})}>
					<DateTime format={DATE_FORMAT} date={assignment.getAssignedDate()} />
				</div>
				<div className={cx('due', {'sorted': sortedOn === 'due'})}>
					<DateTime format={DATE_FORMAT} date={assignment.getDueDate()} />
				</div>
				<div className={cx('score', {'sorted': sortedOn === 'score'})}>{score}</div>
			</div>
		);
	}
});
