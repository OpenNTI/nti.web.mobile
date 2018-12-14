import {getService} from '@nti/web-client';

export default async function hasCalendars () {
	const service = await getService();
	const collection = await service.getCollection('Calendars');
	return !!collection;
}
