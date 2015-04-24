import {getService} from 'common/utils';

export function getEnrollmentService() {
	return getService().then(function(service) {
		return service.getEnrollment();
	});
}

export function enrollOpen(catalogId) {
	return getEnrollmentService().then(function(enrollmentService) {
		return enrollmentService.enrollOpen(catalogId).then(function(result) {
			return {
				serviceResponse: result,
				success: true
			};
		});
	});
}

export function dropCourse(courseId) {
	return getEnrollmentService().then(function(enrollmentService) {
		return enrollmentService.dropCourse(courseId);
	});
}
