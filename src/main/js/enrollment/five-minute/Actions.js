'use strict';

var Constants = require('./Constants');
var AppDispatcher = require('dispatcher/AppDispatcher');

module.exports = {
	preflightAndSubmit: function(data) {
		dispatch(
			Constants.actions.PREFLIGHT_AND_SUBMIT,
			{
				data: data
			}
		);
	},
	doExternalPayment: function(ntiCrnAndTerm) {
		dispatch(
			Constants.actions.DO_EXTERNAL_PAYMENT,
			{
				data: ntiCrnAndTerm
			}
		);
	}
};

function dispatch(key, data) {
	var action = {
		type: key,
		payload: data
	};
	AppDispatcher.handleRequestAction(action);
}
