'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');

var getServer = require('common/Utils').getServer;

module.exports = {

	getPageInfo: function(ntiid) {
		return getServer().getServiceDocument()
			.then(function(service) {
				return service.getPageInfo(ntiid);
			});
	}
};
