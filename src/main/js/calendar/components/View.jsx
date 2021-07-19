import React from 'react';
// import PropTypes from 'prop-types';

import CalendarRouter from './CalendarRouter';

export default function CalendarView({ eventId }) {
	return <CalendarRouter {...{ eventId }} />;
}
