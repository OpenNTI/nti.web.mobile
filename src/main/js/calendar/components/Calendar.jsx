import React from 'react';
import {DarkMode} from '@nti/web-commons';
import {Calendar} from '@nti/web-calendar';

export default class CalendarContainer extends React.Component {
	render () {
		return (
			<>
				<DarkMode/>
				<Calendar className="nti-mobile-calendar" onClose={() => {global.history.back();}}/>
			</>
		);
	}
}
