
'use strict';

var React = require('react/addons');
var EnrollmentStore = require('enrollment').Store;
var StoreEnrollmentStore = require('enrollment/store-enrollment').Store;
var Actions = require('../Actions');
var CatalogActions = require('../catalog/Actions');


var INVALIDATION_EVENTS = {
	DROP_COURSE: true,
	ENROLL_5M: true,
	ENROLL_OPEN: true,
	ENROLL_STORE: true,
	STRIPE_PAYMENT_SUCCESS: true,
	GIFT_CODE_REDEEMED: true
};

function _getType(event) {
	return event && (event.type || (event.action||{}).type);
}

function _flush(event) {

	var type = _getType(event);

	if (!type) {
		console.debug('InvalidationListener: ignoring unknown event: %o', event);
		return;
	}

	var act = INVALIDATION_EVENTS[type];

	if (!act) {
		console.debug('InvalidationListener: ignoring non-invalidation event: %o', event);
		return;
	}

	console.log('InvalidationListener: reloading library in response to event: %O', event);
	Actions.reload();
	CatalogActions.reload();
}

var InvalidationListener = React.createClass({

	componentDidMount: function() {
		EnrollmentStore.addChangeListener(_flush);
		StoreEnrollmentStore.addChangeListener(_flush);
	},

	componentWillUnmount: function() {
		EnrollmentStore.removeChangeListener(_flush);
		StoreEnrollmentStore.removeChangeListener(_flush);
	},

	render: function() {
		return null;
	}

});

module.exports = InvalidationListener;
