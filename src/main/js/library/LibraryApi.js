'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Constants = require('./LibraryConstants');
var Library = require('dataserverinterface/models/Library');

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
			Library.load(service, 'Main')
				.then(dispatch.bind(this, Constants.LOADED_LIBRARY));
	});
}


function dispatch(key, collection) {
    var payload = {actionType: key, response: collection};
	AppDispatcher.handleRequestAction(payload);
}


module.exports = {

	load: load

};
