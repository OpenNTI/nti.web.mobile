'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var Notifications = require('dataserverinterface/stores/Notifications');

var getServer = require('common/Utils').getServer;
var Constants = require('./Constants');


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
