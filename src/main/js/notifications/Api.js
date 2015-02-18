import Notifications from 'dataserverinterface/stores/Notifications';

import {getService} from 'common/utils';

export function load () {
	return getService()
		.then(service =>
			Notifications.load(service));
}
