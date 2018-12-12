import React from 'react';
import {DarkMode} from '@nti/web-commons';
import {Calendar} from '@nti/web-calendar';

import Toolbar from './Toolbar';

export default class CalendarContainer extends React.Component {
	render () {
		return (
			<div className="nti-mobile-calendar-view">
				<DarkMode />
				<Toolbar />
				<Calendar
					headless
					className="nti-mobile-calendar"
					onClose={() => {global.history.back();}}
				/>
			</div>
		);
	}
}
