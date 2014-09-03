'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Constants = require('./LibraryConstants');
var Library = require('dataserverinterface/models/Library');
var dataserver = require('dataserverinterface')($AppConfig).interface;

function load() {
	dataserver.getServiceDocument()
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
