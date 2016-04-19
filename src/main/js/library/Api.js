import {Library} from 'nti-lib-interfaces';

import {getService} from 'nti-web-client';

export function getLibrary (reload) {
	return getService()
			.then(service => Library.get(service, 'Main', reload));
}
