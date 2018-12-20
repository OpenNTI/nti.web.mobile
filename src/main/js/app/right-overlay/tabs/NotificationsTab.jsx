import React from 'react';
import {Badge} from '@nti/web-commons';

import {getCount} from 'notifications/Api';

import ICON from './assets/notifications.svg';

export default class NotificationsTab extends React.Component {

	state = {}

	componentDidMount () {
		this.setUp();
	}

	async setUp () {
		const count = await getCount();
		this.setState({count});
	}

	render () {
		const {count} = this.state;

		return (
			<Badge badge={count} position={Badge.POSITIONS.CENTER_RIGHT}>
				<img src={ICON} className="notifications-icon" />
			</Badge>
		);
	}
}
