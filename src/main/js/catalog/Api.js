'use strict';

var Catalog = require('dataserverinterface/stores/Catalog');

var getServer = require('common/Utils').getServer;

var _catalog;


function load(reload) {
	return getServer().getServiceDocument()
		.then(function(service){
			return Catalog.load(service, reload);
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
