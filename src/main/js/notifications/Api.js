'use strict';

var Notifications = require('dataserverinterface/stores/Notifications');

var getServer = require('common/Utils').getServer;

module.exports = {

	load: function () {
		return getServer().getServiceDocument()
			.then(function(service) {
				return Notifications.load(service);
		});
	}

};
