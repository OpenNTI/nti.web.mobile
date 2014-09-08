'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Library = require('dataserverinterface/stores/Library');

var getServer = require('../common/Utils').getServer;
var Constants = require('./Constants');


function load() {
	return getServer().getServiceDocument()
		.then(function(service){
			return Library.load(service, 'Main')
				.then(function(library) {
					dispatch(Constants.LOADED_LIBRARY, library);
					return library;
				});
	});
}


function dispatch(key, collection) {
    var payload = {actionType: key, response: collection};
	AppDispatcher.handleRequestAction(payload);
}


module.exports = {

	load: load

};
