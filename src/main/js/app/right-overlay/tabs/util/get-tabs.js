import { useContext } from 'react';

import { scoped } from '@nti/lib-locale';
import { DateIcon } from '@nti/web-calendar';
import { BasePathContext } from '@nti/web-routing';

import Notifications from '../Notifications';
import Calendar from '../Calendar';
import Contacts from '../Contacts';
import Footer from '../Footer';
import NotificationsTab from '../NotificationsTab';

import hasCalendars from './has-calendars';

import { TAB_ICON_CLASSNAME } from './';

const NOTIFICATIONS = 'notifications';
const CALENDAR = 'calendar';
const CONTACTS = 'contacts';

const withFooter = Cmp => props =>
	(
		<>
			<Cmp {...props} baseroute={useContext(BasePathContext)} />
			<Footer />
		</>
	);

const t = scoped('app.user-overlay.tabs', {
	[NOTIFICATIONS]: 'Notifications',
	[CALENDAR]: 'Calendar',
	[CONTACTS]: 'Contacts',
});

export default async function getTabs() {
	return {
		[NOTIFICATIONS]: {
			label: t(NOTIFICATIONS),
			labelCmp: <NotificationsTab />,
			component: withFooter(Notifications),
		},
		...(!(await hasCalendars())
			? {}
			: {
					[CALENDAR]: {
						label: t(CALENDAR),
						labelCmp: (
							<DateIcon small className={TAB_ICON_CLASSNAME} />
						),
						component: withFooter(Calendar),
					},
			  }),
		[CONTACTS]: {
			label: t(CONTACTS),
			labelCmp: <div className={TAB_ICON_CLASSNAME}>{t(CONTACTS)}</div>,
			component: withFooter(Contacts),
		},
	};
}
