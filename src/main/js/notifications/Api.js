'use strict';

var Notifications = require('dataserverinterface/stores/Notifications');

var getService = require('common/Utils').getService;

module.exports = {

	load: function () {
		return getService()
			.then(function(service) {
				return Notifications.load(service);
		});
	}

};
