import {Notifications} from '@nti/lib-interfaces';
import {getService} from '@nti/web-client';

export async function load (reload) {
	return getService()
		.then(service =>
			Notifications.load(service, reload));
}

export async function getCount () {
	const {length} = await load();
	return length;
}
