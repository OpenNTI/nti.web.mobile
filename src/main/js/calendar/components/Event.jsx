import React from 'react';
import PropTypes from 'prop-types';

import { getService } from '@nti/web-client';
import { decodeFromURI } from '@nti/lib-ntiids';
import { Event } from '@nti/web-calendar';
import Redirect from 'internal/navigation/components/Redirect';

export default class EventView extends React.Component {
	static propTypes = {
		eventId: PropTypes.string,
	};

	componentDidMount() {
		this.loadEvent();
	}

	async loadEvent() {
		const { eventId } = this.props;

		const service = await getService();
		const event = await service.getObject(decodeFromURI(eventId));

		this.setState({ event });
	}

	state = {};

	goBack = () => {
		this.setState({ close: true });
	};

	render() {
		const { event, close } = this.state;

		if (close) {
			return <Redirect location="/calendar" />;
		} else if (event) {
			return (
				<Event.View
					event={event}
					onCancel={this.goBack}
					onSuccess={this.goBack}
				/>
			);
		}

		return null;
	}
}
