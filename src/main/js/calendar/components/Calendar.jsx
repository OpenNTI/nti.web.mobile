import React from 'react';
import {DarkMode} from '@nti/web-commons';
import {Calendar} from '@nti/web-calendar';

import BackButton from './BackButton';

export default class CalendarContainer extends React.Component {
	render () {
		return (
			<div className="nti-mobile-calendar-view">
				<DarkMode />
				<Calendar
					additionalControls={BackButton}
					className="nti-mobile-calendar"
					onClose={() => {global.history.back();}}
					readOnly
				/>
			</div>
		);
	}
}
