'use strict';

var Library = require('dataserverinterface/stores/Library');

var getService = require('common/Utils').getService;

module.exports = {

	getLibrary: function(reload) {
		return getService()
				.then(service => Library.get(service, 'Main', reload));
	}

};
