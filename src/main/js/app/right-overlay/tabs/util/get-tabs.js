import React from 'react';
import {scoped} from '@nti/lib-locale';
import {DateIcon} from '@nti/web-calendar';

import Notifications from '../Notifications';
import Calendar from '../Calendar';
import Contacts from '../contacts';
import Footer from '../Footer';
import NotificationsTab from '../NotificationsTab';

import hasCalendars from './has-calendars';

const NOTIFICATIONS = 'notifications';
const CALENDAR = 'calendar';
const CONTACTS = 'contacts';

const withFooter = Cmp => props => <><Cmp {...props} /><Footer /></>;

const t = scoped('app.user-overlay.tabs', {
	[NOTIFICATIONS]: 'Notifications',
	[CALENDAR]: 'Calendar',
	[CONTACTS]: 'Contacts'
});

export default async function getTabs () {
	return {
		[NOTIFICATIONS]: {
			label: t(NOTIFICATIONS),
			labelCmp: <NotificationsTab />,
			component: withFooter(Notifications)
		},
		...(!(await hasCalendars()) ? {} : {
			[CALENDAR]: {
				label: t(CALENDAR),
				labelCmp: <DateIcon small />,
				component: withFooter(Calendar)
			},
		}),
		[CONTACTS]: {
			label: t(CONTACTS),
			component: withFooter(Contacts)
		},
	};
}
