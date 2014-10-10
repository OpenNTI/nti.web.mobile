'use strict';

var Library = require('dataserverinterface/stores/Library');

var getService = require('common/Utils').getService;

var _library;

function load(reload) {
	console.log('Library Api: Load called');
	return getService()
		.then(function(service){
			return Library.load(service, 'Main', reload);
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
