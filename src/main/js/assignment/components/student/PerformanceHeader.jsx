import './PerformanceHeader.scss';
import PropTypes from 'prop-types';
import { useEffect, useReducer } from 'react';

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
	const [{ grade }, setState] = useReducer(reducer, {});
	useEffect(() => {
			getGrade(assignments, setState);
	}, [assignments]);

	return (
		<div className="performance-header">
			<div className="course-grade">
				{grade && (
					<>
						<span className="label">{t('courseGrade')}</span>
						<span className="value">
							<FinalGrade grade={grade} />
						</span>
					</>
				)}
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

async function getGrade (assignments, setState) {
	const finalGrade = await getFinalAssignmentGrade(assignments);

	if (finalGrade) {
		setState({grade: finalGrade, predicted: false});
	}

	try {
		const currentGrade = await assignments.parent('getCurrentGrade')?.getCurrentGrade();

		setState({grade: currentGrade});
	} catch (e) {
		setState({grade: null});
	}


}

async function getFinalAssignmentGrade(assignments) {
	try {
		const id = assignments?.getFinalGradeAssignmentId();
		const container = id && await assignments.getHistoryItem(id);
		const historyItem = container?.getMostRecentHistoryItem?.();

		return historyItem?.grade;
	} catch (e) {
		return null;
	}
}
