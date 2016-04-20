import getLink from 'nti-lib-interfaces/lib/utils/getlink';

import {getService} from 'nti-web-client';
import AppDispatcher from 'dispatcher/AppDispatcher';
import {RELOAD as RELOAD_LIBRARY} from 'library/Constants';

export function redeem (code) {
	return getService().then(service => {
		const collection = service.getCollection('Invitations', 'Invitations');
		const href = getLink(collection, 'accept-course-invitations');
		return service.postParseResponse(href, {'invitation_codes': code})
			.then(response => response && response.waitForPending ? response.waitForPending() : response)
			.then(response => {
				AppDispatcher.handleViewAction({type: RELOAD_LIBRARY});
				return response;
			});
	});
}
