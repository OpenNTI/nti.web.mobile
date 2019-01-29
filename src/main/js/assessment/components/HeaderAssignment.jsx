import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from '@nti/lib-commons';
import {NavigationBar} from '@nti/web-assignment-editor';

import Store from '../Store';

import AssignmentStatusLabel from './AssignmentStatusLabel';
import Grade from './Grade';
import TimedPlaceholder from './TimedPlaceholder';
import TimeLockedPlaceholder from './TimeLockedPlaceholder';


export default class extends React.Component {
	static displayName = 'HeaderAssignment';

	static propTypes = {
		assessment: PropTypes.object
	};

	componentDidMount () {
		Store.addChangeListener(this.synchronizeFromStore);
	}

	componentWillUnmount () {
		Store.removeChangeListener(this.synchronizeFromStore);
	}

	componentDidUpdate (props) {
		if (props.assessment !== this.props.assessment) {
			this.synchronizeFromStore();
		}
	}

	synchronizeFromStore = () => {
		this.forceUpdate();
	};

	isLate = (date) => {
		let a = this.props.assessment;
		let ot = a.isOverTime && a.isOverTime();
		return ot || a.isLate(date);
	};

	render () {
		let assignment = this.props.assessment;
		let item = Store.getAssignmentHistoryItem(assignment);
		let admin = Store.isAdministrative(assignment);

		if (!admin && assignment.IsTimedAssignment /*&& !assignment.isStarted()*/) {
			return (
				<TimedPlaceholder assignment={assignment}/>
			);
		}

		const NOW = new Date();
		if (!admin && assignment.getAssignedDate() > NOW) {
			return (
				<TimeLockedPlaceholder assignment={assignment}/>
			);
		}

		let nonSubmit = assignment.isNonSubmit();

		if (admin || !item && !nonSubmit) {
			return null;
		}


		return admin ? this.renderAdmin(assignment, item) : this.renderStudent(assignment, item);
	}


	renderStudent (assignment, historyItem) {
		return (
			<NavigationBar.Status assignment={assignment} historyItem={historyItem} />
		);
	}


	renderAdmin (assignment, historyItem) {
		const nonSubmit = assignment.isNonSubmit();
		const grade = historyItem && historyItem.getGradeValue();
		const date = (historyItem && historyItem.getCreatedTime()) || new Date();

		const late = this.isLate(date);
		const state = late ? 'late' : nonSubmit ? '' : 'ontime';

		return (
			<div className={'header assessment common assignment ' + state}>
				<div className="meta">
					<h4>{assignment.title}</h4>
					<AssignmentStatusLabel assignment={assignment} historyItem={historyItem} showTimeWithDate/>
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
}
