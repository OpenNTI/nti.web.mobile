import {getService} from 'common/utils';

export function getEnrollmentService () {
	return getService().then(service => service.getEnrollment());
}

export function enrollOpen (catalogId) {
	return getEnrollmentService().then(enrollmentService =>
		enrollmentService.enrollOpen(catalogId)
			.then(result =>
				({ serviceResponse: result, success: true })));
}

export function dropCourse (courseId) {
	return getEnrollmentService().then(enrollmentService =>
		enrollmentService.dropCourse(courseId));
}
