'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Notifications = require('dataserverinterface/store/Notifications');

var getServer = require('../common/Utils').getServer;
var Constants = require('./Constants');



function load() {
	getServer().getServiceDocument()
		.then(function(service){

		});
}


module.exports = {


};
