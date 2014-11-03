'use strict';

var getService = require('common/Utils').getService;

module.exports = {

	getPageInfo: function(ntiid) {
		return getService()
			.then(function(service) {
				return service.getPageInfo(ntiid);
			});
	}
};
