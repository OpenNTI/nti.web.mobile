import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Switch} from '@nti/web-commons';
import Storage from '@nti/web-storage';
import cx from 'classnames';

import Notifications from './Notifications';
import Calendar from './Calendar';
import Contacts from './contacts';

const NOTIFICATIONS = 'notifications';
const CALENDAR = 'calendar';
const CONTACTS = 'contacts';

const storageKey = 'app:right-overlay:tabs:selected-tab';

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

class Tab extends React.Component {
	static propTypes = {
		item: PropTypes.string,
		label: PropTypes.string,
		children: PropTypes.any,
		className: PropTypes.string
	}

	rememberSelectedTab = () => Storage.setItem(storageKey, this.props.item)

	render () {
		const {children, className, ...other} = this.props;

		return (
			<Switch.Trigger
				className={cx('tab-label', className)}
				onClick={this.rememberSelectedTab}
				{...other}
			>
				{children}
			</Switch.Trigger>
		);
	}
}

export default class View extends React.Component {

	renderTrigger = ([key, {label}]) => (
		<Tab key={key} item={key} className={key} title={label}>{label}</Tab>
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
		const active = Storage.getItem(storageKey) || Object.keys(TABS)[0];

		return (
			<Switch.Panel className="nti-mobile-drawer-tab-panel" active={active}>
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
