import React from 'react';
import {scoped} from '@nti/lib-locale';
import {Switch} from '@nti/web-commons';
import cx from 'classnames';

import Notifications from './Notifications';
import Calendar from './Calendar';
import Contacts from './Contacts';

const NOTIFICATIONS = 'notifications';
const CALENDAR = 'calendar';
const CONTACTS = 'contacts';

const t = scoped('app.user-overlay.tabs', {
	[NOTIFICATIONS]: 'Notifications',
	[CALENDAR]: 'Calendar',
	[CONTACTS]: 'Contacts'
});

const TABS = {
	[NOTIFICATIONS]: {
		label: t(NOTIFICATIONS),
		component: Notifications
	},
	[CALENDAR]: {
		label: t(CALENDAR),
		component: Calendar
	},
	[CONTACTS]: {
		label: t(CONTACTS),
		component: Contacts
	},
};

export default class View extends React.Component {

	renderTrigger = ([key, {label}]) => (
		<Switch.Trigger
			className={cx('tab-label', key)}
			key={key}
			item={key}
			title={label}
		>
			{label}
		</Switch.Trigger>
	)

	renderItem = ([key, {label, component}]) => (
		<Switch.Item
			className={key}
			key={key}
			name={key}
			component={component}
		/>
	)

	render () {
		return (
			<Switch.Panel className="nti-mobile-drawer-tab-panel" active={Object.keys(TABS)[0]}>
				<Switch.Controls className="nti-mobile-drawer-tabs">
					{Object.entries(TABS).map(this.renderTrigger)}
				</Switch.Controls>
				<Switch.Container className="nti-mobile-drawer-tab-content">
					{Object.entries(TABS).map(this.renderItem)}
				</Switch.Container>
			</Switch.Panel>
		);
	}
}
