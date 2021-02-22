import React from 'react';
// import PropTypes from 'prop-types';

import CalendarRouter from './CalendarRouter';

export default class CalendarView extends React.Component {
	// static contextTypes: {
	// 	router: PropTypes.object
	// }
	//
	//
	// static childContextTypes: {
	// 	router: PropTypes.object
	// }
	//
	// getChildContext () {
	// 	return {
	// 		router: {
	// 			...(this.context.router || {}),
	// 			baseroute: '/mobile/calendar/',
	// 			// getRouteFor: () => {}
	// 		}
	// 	};
	// }

	render() {
		return <CalendarRouter />;
	}
}
