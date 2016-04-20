import {getService} from 'nti-web-client';

export function getPageInfo (ntiid) {
	return getService()
		.then(service => service.getPageInfo(ntiid));
}
