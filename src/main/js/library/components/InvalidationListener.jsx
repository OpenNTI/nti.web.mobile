import React from 'react';

import {
	DROP_COURSE,
	ENROLL_5M,
	ENROLL_OPEN,
	ENROLL_STORE
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


const INVALIDATION_EVENTS = {
	[DROP_COURSE]: true,
	[ENROLL_5M]: true,
	[ENROLL_OPEN]: true,
	[ENROLL_STORE]: true,
	[STRIPE_PAYMENT_SUCCESS]: true,
	[GIFT_CODE_REDEEMED]: true
};

function flush (event) {

	let type = event && (event.type || (event.action || {}).type);
	if (!type) {
		return;
	}

	let act = INVALIDATION_EVENTS[type];

	if (!act) {
		// console.debug('InvalidationListener: ignoring non-invalidation event: %o', event);
		return;
	}

	console.log('InvalidationListener: reloading library and catalog in response to event: %s %O', type, event);
	// [Data] go down the hoooOOolle...
	// https://www.youtube.com/watch?v=pTsem5E6EeY#t=144
	reloadLibrary();
	reloadCatalog();
}


export default React.createClass({
	displayName: 'InvalidationListener',

	componentDidMount () {
		CatalogStore.addChangeListener(flush);
		EnrollmentStore.addChangeListener(flush);
		StoreEnrollmentStore.addChangeListener(flush);
	},


	componentWillUnmount () {
		EnrollmentStore.removeChangeListener(flush);
		StoreEnrollmentStore.removeChangeListener(flush);
	},


	render () {
		return null;
	}

});
