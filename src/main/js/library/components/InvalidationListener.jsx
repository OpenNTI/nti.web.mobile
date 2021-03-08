import React from 'react';

import Logger from '@nti/util-logger';
import AppDispatcher from '@nti/lib-dispatcher';
import { STRIPE_PAYMENT_SUCCESS } from 'internal/enrollment/store-enrollment/Constants';
import EnrollmentStore from 'internal/enrollment/Store';
import StoreEnrollmentStore from 'internal/enrollment/store-enrollment/Store';
import { reload as reloadNotifications } from 'internal/notifications/Actions';

import { reload as reloadLibrary } from '../Actions';
import { RELOAD } from '../Constants';

const logger = Logger.get('InvalidationListener');

const INVALIDATION_EVENTS = {
	[STRIPE_PAYMENT_SUCCESS]: true,
	[RELOAD]: true,
};

function flush(event) {
	let type = event && (event.type || (event.action || {}).type);
	if (!type) {
		return;
	}

	let act = INVALIDATION_EVENTS[type];

	if (!act) {
		logger.debug('ignoring non-invalidation event: %o', event);
		return;
	}

	logger.debug(
		'reloading library and catalog in response to event: %s %o',
		type,
		event
	);
	reloadLibrary();
	reloadNotifications();
}

export default class extends React.Component {
	static displayName = 'InvalidationListener';

	componentDidMount() {
		this.reloadToken = AppDispatcher.register(flush);
		EnrollmentStore.addChangeListener(flush);
		StoreEnrollmentStore.addChangeListener(flush);
	}

	componentWillUnmount() {
		AppDispatcher.unregister(this.reloadToken);
		EnrollmentStore.removeChangeListener(flush);
		StoreEnrollmentStore.removeChangeListener(flush);
	}

	render() {
		return null;
	}
}
