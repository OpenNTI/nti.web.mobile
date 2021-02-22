import './Notifications.scss';
import React from 'react';

import List from 'notifications/components/View';

export default function Notifications(props) {
	return (
		<div className="notifications-list-wrapper">
			<h3>Notifications</h3>
			<List />
		</div>
	);
}
