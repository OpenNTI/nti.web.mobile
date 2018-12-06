import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {NotableEvents} from '@nti/web-calendar';
import {HOC} from '@nti/web-commons';

const t = scoped('app.user-overlay.calendar-events', {
	allEvents: 'All Events'
});

export default
@HOC.BasePath.connect
class Events extends React.PureComponent {

	static propTypes = {
		basePath: PropTypes.string
	}

	render () {
		const {basePath} = this.props;

		return (
			<>
			<NotableEvents />
			<a href={`${basePath}calendar`}>{t('allEvents')}</a>
			</>
		);
	}
}
