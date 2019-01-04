import React from 'react';
import {Badge} from '@nti/web-commons';
import cx from 'classnames';

import {getCount} from 'notifications/Api';

import {TAB_ICON_CLASSNAME} from './util';
import ICON from './assets/notifications.svg';

export default class NotificationsTab extends React.Component {

	state = {}

	componentDidMount () {
		this.setUp();
	}

	componentWillUnmount () {
		this.unmounted = true;
	}

	async setUp () {
		const count = await getCount();
		if (!this.unmounted) {
			this.setState({count});
		}
	}

	render () {
		const {count} = this.state;

		return (
			<Badge badge={count} position={Badge.POSITIONS.CENTER_RIGHT}>
				<img src={ICON} className={cx(TAB_ICON_CLASSNAME, 'notifications-icon')} />
			</Badge>
		);
	}
}
