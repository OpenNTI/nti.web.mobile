import './Calendar.scss';
import React from 'react';

import { DarkMode } from '@nti/web-commons';
import { Calendar } from '@nti/web-calendar';

import BackButton from './BackButton';
import Event from './Event';

export default function CalendarContainer({ eventId }) {
	return (
		<div className="nti-mobile-calendar-view">
			<DarkMode />
			{eventId ? (
				<Event eventId={eventId} />
			) : (
				<Calendar
					additionalControls={BackButton}
					className="nti-mobile-calendar"
					onClose={() => {
						global.history.back();
					}}
					readOnly
				/>
			)}
		</div>
	);
}
