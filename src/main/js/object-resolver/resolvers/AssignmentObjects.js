import {join} from 'path';

import {getService} from 'nti-web-client';
import {encodeForURI} from 'nti-lib-ntiids';

const isAssignmentRelated = RegExp.prototype.test.bind(/\.(grade|userscourseassignmenthistoryitemfeedback)/i);
const isAssignment = RegExp.prototype.test.bind(/\.assignment/i);

export default class AssignmentsResolver {

	static handles (o) {
		let {MimeType, AssignmentId} = o || {};
		return isAssignment(o) || (isAssignmentRelated(MimeType) && AssignmentId);
	}

	static resolve (o) {
		return new AssignmentsResolver(o).getPath();
	}

	constructor (o) {
		this.object = o;
	}

	getCourse () {
		const assignmentId = this.getAssignmentId();
		return getService()
			.then(s => s.getContextPathFor(assignmentId))
			.then(path => path[0][0]);
	}

	getAssignmentId () {
		const {object} = this;
		return object.AssignmentId || object.getID();
	}

	getPath () {
		// mobile/course/
		// system-OID-0x013381%3A5573657273%3AhkG6cg409U6/ <-- course id
		// assignments/
		// OU-NAQ-ANTH4970_S_2015_Practical_Importance_of_Human_Evolution.naq.asg.assignment%3A14_end_survey/

		//For a student specific view (from an instructors view)
		//append:
		//	/students/<userid>

		return this.getCourse().then(course =>
				join(
					'course',
					encodeForURI(course.getID()),
					'assignments',
					encodeForURI(this.getAssignmentId()),
					'/'
				)
			);
	}

}
