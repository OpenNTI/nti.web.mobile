import {Notifications} from 'nti.lib.interfaces';

import {getService} from 'common/utils';

export function load () {
	return getService()
		.then(service =>
			Notifications.load(service));
}
