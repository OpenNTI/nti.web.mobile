import { useContext } from 'react';

import { BasePathContext } from '@nti/web-routing';

import CalendarRouter from './CalendarRouter';

export default function CalendarView({ eventId }) {
	const baseroute = useContext(BasePathContext);
	return <CalendarRouter {...{ baseroute, eventId }} />;
}
