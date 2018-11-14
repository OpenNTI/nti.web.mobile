import {getModel} from '@nti/lib-interfaces';

const HistoryItemContainer = getModel('assessment.userscourseassignmenthistoryitemcontainer');

export default function MockAssignmentHistory (created = new Date(), submitted = true, excused = false) {
	const proto = {
		MimeType: 'application/vnd.nextthought.assessment.userscourseassignmenthistoryitemcontainer',
		getCreatedTime: () => created,
		getMostRecentHistoryItem: () => {
			return {
				MimeType: 'application/vnd.nextthought.assessment.assignmenthistoryitem',
				isSubmitted: () => submitted,
				isGradeExcused: () => excused,
				getCreatedTime: () => created,
				isSyntheticSubmission: () => false
			};
		}
	};

	return Object.assign(Object.create(HistoryItemContainer.prototype), proto);
}
