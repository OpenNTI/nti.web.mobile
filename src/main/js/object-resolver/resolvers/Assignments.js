import {join} from 'path';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const isAssignment = RegExp.prototype.test.bind(/\.assignment/i);

export default class AssignmentsResolver {

	static handles (o) {
		let {MimeType} = o || {};
		return isAssignment(MimeType);
	}

	static resolve (o) {
		return new AssignmentsResolver(o).getPath();
	}

	constructor (o) {
		this.assignment = o;
	}

	getPath () {
		// mobile/course/
		// system-OID-0x013381%3A5573657273%3AhkG6cg409U6/ <-- course id
		// assignments/
		// OU-NAQ-ANTH4970_S_2015_Practical_Importance_of_Human_Evolution.naq.asg.assignment%3A14_end_survey/
		//
		return this.assignment.getContextPath()
		.then(path => {
			return join(
				'course',
				encodeForURI(path[0][0].getID()),
				'assignments',
				encodeForURI(this.assignment.getID()),
				'/'
			);
		});
	}

}
