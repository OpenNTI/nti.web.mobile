import Notifications from 'dataserverinterface/stores/Notifications';

import {getService} from 'common/Utils';

export function load () {
	return getService()
		.then(service =>
			Notifications.load(service));
}
