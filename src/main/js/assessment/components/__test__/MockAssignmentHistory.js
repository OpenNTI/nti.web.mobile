import {getModel} from '@nti/lib-interfaces';

const HistoryItem = getModel('assessment.assignmenthistoryitem');

export default function MockAssignmentHistory (created = new Date(), submitted = true, excused = false) {
	const proto = {
		MimeType: 'application/vnd.nextthought.assessment.assignmenthistoryitem',
		isSubmitted: () => submitted,
		isGradeExcused: () => excused,
		getCreatedTime: () => created
	};

	return Object.assign(Object.create(HistoryItem.prototype), proto);
}
