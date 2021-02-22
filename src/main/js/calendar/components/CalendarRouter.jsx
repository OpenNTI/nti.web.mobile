import { Router, Route } from '@nti/web-routing';

import { getRouteFor } from '../RouteHandler';

import Calendar from './Calendar';
// import Event from './Event';
// import Webinar from './Webinar';

export default Router.for([
	// Route({
	// 	path: '/event/:eventId(/*)',
	// 	component: Event
	// }),
	// Route({
	// 	path: '/webinar/:webinarId(/*)',
	// 	component: Webinar
	// }),
	Route({
		path: '/',
		getRouteFor,
		component: Calendar,
	}),
]);
