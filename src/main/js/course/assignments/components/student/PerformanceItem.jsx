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

		assignment.getHistory(true)
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
		let completed = assignment.hasLink('History');
		let {score} = this.state;

		let completedClasses = cx('completed', {
			'yes': completed,
			'no': !completed,
			'icon-check': completed,
			'sorted': sortedOn === 'completed'
		});

		score = score && Math.round(score * 100) / 100;

		return (
			<div className="performance-item">
				<div className={completedClasses}></div>
				<a href={`./${encodeForURI(assignment.getID())}/`}>
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
