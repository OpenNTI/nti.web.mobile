'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Notifications = require('dataserverinterface/store/Notifications');

var Constants = require('./Constants');

function getServer() {
	var fn = getServer;
	if (!fn.server) {
		fn.server = require('dataserverinterface')($AppConfig).interface;
	}
	return fn.server;
}

function load() {
	getServer().getServiceDocument()
		.then(function(service){
			Notifications.load(service)
				.then(dispatch.bind(this, Constants.LOADED_NOTIFICATIONS));
	});
}


function dispatch(key, collection) {
    var payload = {actionType: key, response: collection};
	AppDispatcher.handleRequestAction(payload);
}


module.exports = {

	load: load

};
