'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Library = require('dataserverinterface/stores/Library');

var getServer = require('../common/Utils').getServer;
var Constants = require('./Constants');

var _library;


function dispatch(key, collection) {
	var payload = {actionType: key, response: collection};
	AppDispatcher.handleRequestAction(payload);
}


function load(reload) {
	return getServer().getServiceDocument()
		.then(function(service){
			return Library.load(service, 'Main', reload)
				.then(function(library) {
					dispatch(Constants.LOADED_LIBRARY, library);
					return library;
				});
	});
}


function getLibrary(reload) {

	if (!_library || reload) {
		_library = load(reload);
	}

	return _library;
}



module.exports = {

	getLibrary: getLibrary

};
