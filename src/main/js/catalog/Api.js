'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Catalog = require('dataserverinterface/stores/Catalog');

var getServer = require('../common/Utils').getServer;
var Constants = require('./Constants');

var _catalog;


function dispatch(key, collection) {
	var payload = {actionType: key, response: collection};
	AppDispatcher.handleRequestAction(payload);
}


function load(reload) {
	return getServer().getServiceDocument()
		.then(function(service){
			return Catalog.load(reload)
				.then(function(catalog) {
					dispatch(Constants.LOADED_CATALOG, catalog);
					return catalog;
				});
	});
}


function getCatalog(reload) {

	if (!_catalog || reload) {
		_catalog = load(reload);
	}

	return _catalog;
}



module.exports = {

	getCatalog: getCatalog

};
