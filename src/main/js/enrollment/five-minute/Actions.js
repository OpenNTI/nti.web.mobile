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
	
	// @param {object} data should inlude props for link, ntiCrn, and ntiTerm
	doExternalPayment: function(data) {
		dispatch(
			Constants.actions.DO_EXTERNAL_PAYMENT,
			{
				data: data
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
