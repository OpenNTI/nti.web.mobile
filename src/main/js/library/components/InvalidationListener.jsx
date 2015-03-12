import React from 'react';

import {
	DROP_COURSE,
	ENROLL_5M,
	ENROLL_OPEN,
	ENROLL_STORE
} from 'enrollment/Constants';
import EnrollmentStore from 'enrollment/Store';
import StoreEnrollmentStore from 'enrollment/store-enrollment/Store';

import {reload as reloadLibrary} from '../Actions';
import {reload as reloadCatalog} from 'catalog/Actions';


const INVALIDATION_EVENTS = {
	[DROP_COURSE]: true,
	[ENROLL_5M]: true,
	[ENROLL_OPEN]: true,
	[ENROLL_STORE]: true,
	//TODO: convert these to constant references
	STRIPE_PAYMENT_SUCCESS: true,
	GIFT_CODE_REDEEMED: true
};


function flush (event) {

	var type = event && (event.type || (event.action||{}).type);
	if (!type) {
		return;
	}

	var act = INVALIDATION_EVENTS[type];

	if (!act) {
		console.debug('InvalidationListener: ignoring non-invalidation event: %o', event);
		return;
	}

	console.log('InvalidationListener: reloading library in response to event: %O', event);
	// [Data] go down the hoooOOolle...
	// https://www.youtube.com/watch?v=pTsem5E6EeY#t=144
	reloadLibrary();
	reloadCatalog();
}


export default React.createClass({
	displayName: 'InvalidationListener',

	componentDidMount () {
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
