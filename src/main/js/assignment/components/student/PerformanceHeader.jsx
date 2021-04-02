import './PerformanceHeader.scss';
import PropTypes from 'prop-types';
import React, { useEffect, useReducer } from 'react';

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

const reducer = (s, action) => ({ ...s, ...action });

PerformanceHeader.propTypes = {
	assignments: PropTypes.object.isRequired,
};
export default function PerformanceHeader({ assignments }) {
	const [{ grade, id }, setState] = useReducer(reducer, {});

	useEffect(() => {
		if (assignments?.getFinalGradeAssignmentId() !== id) {
			getFinalGrade(assignments, setState);
		}
	}, [assignments, id]);

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

async function getFinalGrade(assignments, setState) {
	const id = assignments?.getFinalGradeAssignmentId();
	if (id) {
		const container = await assignments.getHistoryItem(id);
		const historyItem = container?.getMostRecentHistoryItem?.();
		if (historyItem) {
			setState({ id, grade: historyItem.grade });
		}
	}
}
