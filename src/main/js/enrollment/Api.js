import {getService} from 'nti-web-client';
import AppDispatcher from 'nti-lib-dispatcher';

import {RELOAD as RELOAD_LIBRARY} from 'library/Constants';

export async function getEnrollmentService () {
	const service = await getService();
	return service.getEnrollment();
}

export async function enrollOpen (catalogId) {
	const enrollmentService = await getEnrollmentService();
	const response = await enrollmentService.enrollOpen(catalogId);

	AppDispatcher.handleViewAction({type: RELOAD_LIBRARY});

	return {
		serviceResponse: response,
		success: true
	};
}


export async function dropCourse (courseId) {
	const enrollmentService = await getEnrollmentService();
	const response = await enrollmentService.dropCourse(courseId);
	AppDispatcher.handleViewAction({type: RELOAD_LIBRARY});
	return response;
}


export async function getCatalogEntry (id) {
	const service = await getService();
	let entry;
	try {
		entry = await service.getObject(id);
	} catch (e) {
		entry = Array.isArray(e.Items)
			// If we have an Items array, its a list of catalog entries...
			// Grab the first and continue...
			? await service.getObject(e.Items[0])
			// re throw...
			: throw e;
	}

	return entry;
}
