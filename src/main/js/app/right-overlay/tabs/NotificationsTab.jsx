import './NotificationsTab.scss';
import React from 'react';
import cx from 'classnames';

import { TAB_ICON_CLASSNAME } from './util';
import ICON from './assets/notifications.svg';

export default class NotificationsTab extends React.Component {
	state = {};

	render() {
		return (
			<div>
				<img
					src={ICON}
					className={cx(TAB_ICON_CLASSNAME, 'notifications-icon')}
				/>
			</div>
		);
	}
}
