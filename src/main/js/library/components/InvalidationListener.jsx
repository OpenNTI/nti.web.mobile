import React from 'react';
import Logger from 'nti-util-logger';

import AppDispatcher from 'dispatcher/AppDispatcher';

import {
	DROP_COURSE,
	ENROLL_OPEN
} from 'enrollment/Constants';

import {
	STRIPE_PAYMENT_SUCCESS
} from 'enrollment/store-enrollment/Constants';

import {GIFT_CODE_REDEEMED} from 'catalog/Constants';

import EnrollmentStore from 'enrollment/Store';
import StoreEnrollmentStore from 'enrollment/store-enrollment/Store';
import CatalogStore from 'catalog/Store';

import {reload as reloadLibrary} from '../Actions';
import {reload as reloadCatalog} from 'catalog/Actions';
import {reload as reloadNotifications} from 'notifications/Actions';

const logger = Logger.get('InvalidationListener');

import {RELOAD} from '../Constants';

const INVALIDATION_EVENTS = {
	[DROP_COURSE]: true,
	[ENROLL_OPEN]: true,
	[STRIPE_PAYMENT_SUCCESS]: true,
	[GIFT_CODE_REDEEMED]: true,
	[RELOAD]: true
};

function flush (event) {

	let type = event && (event.type || (event.action || {}).type);
	if (!type) {
		return;
	}

	let act = INVALIDATION_EVENTS[type];

	if (!act) {
		logger.debug('ignoring non-invalidation event: %o', event);
		return;
	}

	logger.debug('reloading library and catalog in response to event: %s %o', type, event);
	// [Data] go down the hoooOOolle...
	// https://www.youtube.com/watch?v=pTsem5E6EeY#t=144
	reloadLibrary();
	reloadCatalog();
	reloadNotifications();
}

export default React.createClass({
	displayName: 'InvalidationListener',

	componentDidMount () {
		this.reloadToken = AppDispatcher.register(flush);
		CatalogStore.addChangeListener(flush);
		EnrollmentStore.addChangeListener(flush);
		StoreEnrollmentStore.addChangeListener(flush);
	},


	componentWillUnmount () {
		AppDispatcher.unregister(this.reloadToken);
		EnrollmentStore.removeChangeListener(flush);
		StoreEnrollmentStore.removeChangeListener(flush);
	},


	render () {
		return null;
	}

});
