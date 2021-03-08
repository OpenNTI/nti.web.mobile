import './PerformanceHeader.scss';
import PropTypes from 'prop-types';
import React from 'react';

import { scoped } from '@nti/lib-locale';

import FinalGrade from './FinalGrade';
import CompletionRatio from './CompletionRatio';

const t = scoped(
	'nti-web-mobile.assignment.component.student.PerformanceHeader',
	{
		courseGrade: 'Course Grade',
		assignmentsCompleted: 'Assignments Completed',
	}
);

export default class PerformanceHeader extends React.Component {
	static propTypes = {
		assignments: PropTypes.object.isRequired,
	};

	state = {};

	componentDidMount() {
		this.getFinalGrade();
	}

	componentDidUpdate() {
		const {
			props: { assignments },
			state: { id },
		} = this;
		if (assignments && assignments.getFinalGradeAssignmentId() !== id) {
			this.getFinalGrade();
		}
	}

	getFinalGrade = async (props = this.props) => {
		const { assignments } = props;
		const id = assignments && assignments.getFinalGradeAssignmentId();
		if (id) {
			const container = await assignments.getHistoryItem(id);
			const historyItem =
				container &&
				container.getMostRecentHistoryItem &&
				container.getMostRecentHistoryItem();
			if (historyItem) {
				this.setState({ id, grade: historyItem.grade });
			}
		}
	};

	render() {
		const { assignments } = this.props;
		const { grade } = this.state;

		return (
			<div className="performance-header">
				<div className="course-grade">
					<span className="label">{t('courseGrade')}</span>
					<span className="value">
						<FinalGrade grade={grade} />
					</span>
				</div>
				<div className="completed-assignments">
					<span className="label">{t('assignmentsCompleted')}</span>
					<span className="value">
						<CompletionRatio assignments={assignments} />
					</span>
				</div>
			</div>
		);
	}
}
