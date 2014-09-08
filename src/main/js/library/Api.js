'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Library = require('dataserverinterface/stores/Library');

var getServer = require('../common/Utils').getServer;
var Constants = require('./Constants');

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
