import {Notifications} from 'nti-lib-interfaces';

import {getService} from 'nti-web-client';

export function load (reload) {
	return getService()
		.then(service =>
			Notifications.load(service, reload));
}
