import getLink from 'nti-lib-interfaces/lib/utils/getlink';
import {getService} from 'common/utils';

export function redeem (code) {
	return getService().then(service => {
		const collection = service.getCollection('Invitations', 'Invitations');
		const href = getLink(collection, 'accept-course-invitations');
		return service.postParseResponse(href, {'invitation_codes': code});
	});
}
