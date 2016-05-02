import getLink from 'nti-lib-interfaces/lib/utils/getlink';

import {getService} from 'nti-web-client';
import AppDispatcher from 'dispatcher/AppDispatcher';
import {RELOAD as RELOAD_LIBRARY} from 'library/Constants';

const SEND_LINK = 'SendCourseInvitations';
const ACCEPT_LINK = 'accept-course-invitations';

export function accept (code) {
	return getService().then(service => {
		const collection = service.getCollection('Invitations', 'Invitations');
		const href = getLink(collection, ACCEPT_LINK);
		return service.postParseResponse(href, {'invitation_codes': code})
			.then(response => response && response.waitForPending ? response.waitForPending() : response)
			.then(response => {
				AppDispatcher.handleViewAction({type: RELOAD_LIBRARY});
				return response;
			});
	});
}

export function send (course, name, email, message) {
	const href = course.getLink(SEND_LINK);
	if (!href) {
		return Promise.reject('No link');
	}
	return getService()
		.then(service => service.postParseResponse(href, { name, email, message }));
}

export function canSend (course) {
	return course && course.hasLink && course.hasLink(SEND_LINK);
}
