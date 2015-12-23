import React from 'react';

import DateTime from './DateTime';

export default function CalendarCard (props) {
	const {date} = props;

	return !date ? (
		<div/>
	) : (
		<div className="calendar-card">
			<DateTime date={date} className="month" format="MMM"/>
			<DateTime date={date} className="day" format="DD"/>
		</div>
	);
}
