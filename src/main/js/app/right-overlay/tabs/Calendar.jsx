import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {NotableEvents} from '@nti/web-calendar';
import {HOC} from '@nti/web-commons';

import ErrorBoundary from './ErrorBoundary';

const t = scoped('app.user-overlay.calendar-events', {
	heading: 'Upcoming Events',
	allEvents: 'All Events',
	error: 'Unable to display upcoming events. An error occurred.'
});

const getErrorMessage = e => <div className="calendar-display-error">{t('error')}</div>;

export default
@HOC.BasePath.connect
@ErrorBoundary(getErrorMessage)
class Events extends React.PureComponent {

	static propTypes = {
		basePath: PropTypes.string
	}

	render () {
		const {basePath} = this.props;

		return (
			<div className="upcoming-calendar-events">
				<h3>Upcoming Events</h3>
				<NotableEvents>
					<a href={`${basePath}calendar`}>{t('allEvents')}</a>
				</NotableEvents>
			</div>
		);
	}
}
