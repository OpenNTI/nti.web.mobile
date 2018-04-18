import {getService} from '@nti/web-client';

export async function getCourse (courseId) {
	if(!courseId) {
		return;
	}

	const service = await getService();
	return service.getObject(courseId);
}
