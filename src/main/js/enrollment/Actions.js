import AppDispatcher from '@nti/lib-dispatcher';

import { ENROLL_OPEN, DROP_COURSE } from './Constants';

export function enrollOpen(catalogId) {
	dispatch(ENROLL_OPEN, { catalogId });
}

export function dropCourse(courseId) {
	dispatch(DROP_COURSE, { courseId });
}

function dispatch(type, data) {
	AppDispatcher.handleRequestAction({
		type: 'Course-Enrollment-Changed',
		data: {},
	});
	AppDispatcher.handleRequestAction(Object.assign(data, { type }));
}
