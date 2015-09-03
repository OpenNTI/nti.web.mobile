import React from 'react';

import Store from '../Store';

import AssignmentStatusLabel from './AssignmentStatusLabel';
import Grade from './Grade';

import TimedPlaceholder from './TimedPlaceholder';
import TimeLockedPlaceholder from './TimeLockedPlaceholder';

import isEmpty from 'nti.lib.interfaces/utils/isempty';

export default React.createClass({
	displayName: 'HeaderAssignment',

	propTypes: {
		assessment: React.PropTypes.object
	},

	componentDidMount () {
		Store.addChangeListener(this.synchronizeFromStore);
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.synchronizeFromStore);
	},


	componentWillReceiveProps (props) {
		this.synchronizeFromStore(props);
	},


	synchronizeFromStore () {
		this.forceUpdate();
	},


	isLate  (date) {
		let a = this.props.assessment;
		let ot = a.isOverTime && a.isOverTime();
		return ot || a.isLate(date);
	},


	render () {
		let assignment = this.props.assessment;
		let item = Store.getAssignmentHistoryItem(assignment);

		if (assignment.IsTimedAssignment /*&& !assignment.isStarted()*/) {
			return (
				<TimedPlaceholder assignment={assignment}/>
			);
		}

		const NOW = new Date();
		if (assignment.getAvailableForSubmissionBeginning() > NOW) {
			return (
				<TimeLockedPlaceholder assignment={assignment}/>
			);
		}

		let nonSubmit = assignment.isNonSubmit();

		if (!item && !nonSubmit) {
			return null;
		}

		let grade = item && item.getGradeValue();
		let date = (item && item.getCreatedTime()) || new Date();

		let late = this.isLate(date);
		let state = late ? 'late' : nonSubmit ? '' : 'ontime';

		return (
			<div className={'header assessment assignment ' + state}>
				<div className="meta">
					<h4>{assignment.title}</h4>
					<AssignmentStatusLabel assignment={assignment} historyItem={item}/>
				</div>

				{isEmpty(grade) ? null : (
					<div className="grade-container">
						<h6>Assignment Grade</h6>
						<Grade value={grade}/>
					</div>
				)}
			</div>
		);
	}
});
