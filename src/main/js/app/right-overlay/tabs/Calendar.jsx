import './Calendar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {NotableEvents} from '@nti/web-calendar';
import {HOC} from '@nti/web-commons';
import {Router, Route} from '@nti/web-routing';

import {getRouteFor} from 'calendar/RouteHandler';

import ErrorBoundary from './ErrorBoundary';

const t = scoped('app.user-overlay.calendar-events', {
	heading: 'Upcoming Events',
	allEvents: 'All Events',
	error: 'Unable to display upcoming events. An error occurred.'
});

const getErrorMessage = e => <div className="calendar-display-error">{t('error')}</div>;

@HOC.BasePath.connect
@ErrorBoundary(getErrorMessage)
class Events extends React.PureComponent {

	static propTypes = {
		basePath: PropTypes.string
	}

	render () {
		// const {basePath} = this.props;

		return (
			<div className="upcoming-calendar-events">
				<h3>Upcoming Events</h3>
				<NotableEvents />
				<a className="all-events-link" href="#calendar">{t('allEvents')}</a>
			</div>
		);
	}
}

export default Router.for([
	Route({
		path: '/',
		getRouteFor,
		component: Events
	})
]);
