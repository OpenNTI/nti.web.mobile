import getLink from 'nti-lib-interfaces/lib/utils/getlink';

import {getService} from 'nti-web-client';
import AppDispatcher from 'nti-lib-dispatcher';
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

export function send (course, email, message) {
	const href = course.getLink(SEND_LINK);
	if (!href) {
		return Promise.reject('No link');
	}
	return getService()
		.then(service => service.postParseResponse(href, { email, message }));
}

export function canSend (course) {
	return course && course.hasLink && course.hasLink(SEND_LINK);
}

export function canAccept () {
	if (!canAccept.hasAcceptLink) {
		canAccept.hasAcceptLink = getService().then(service => {
			const collection = service.getCollection('Invitations', 'Invitations');
			const href = getLink(collection, ACCEPT_LINK);
			return !!href;
		});
	}
	return canAccept.hasAcceptLink;
}
