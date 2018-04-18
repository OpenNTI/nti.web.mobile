import {getModel} from '@nti/lib-interfaces';

const Assignment = getModel('assessment.assignment');

export default function MockAssignment (props = {}, NoSubmit = false) {
	const proto = {
		MimeType: 'application/vnd.nextthought.assessment.assignment',
		canBeSubmitted: () => !NoSubmit,
		isNonSubmit: () => NoSubmit,
		isLate: () => true,
		isPublished: () => true,
		getDueDate () {
			let d = this['available_for_submission_ending'];
			return d ? new Date(d) : null;
		},
		getAssignedDate () {
			let d = this['available_for_submission_beginning'];
			return d ? new Date(d) : null;
		},
		getAvailableForSubmissionBeginning () { return this.getAssignedDate(); },
		['available_for_submission_ending']: '2015-08-29T04:59:59Z',
		['available_for_submission_beginning']: '2014-08-16T05:00:00Z'
	};

	return Object.assign(Object.create(Assignment.prototype), proto, props);
}
