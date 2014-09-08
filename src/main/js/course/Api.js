'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');

var getServer = require('../common/Utils').getServer;
var Constants = require('./Constants');



function load() {
	getServer().getServiceDocument()
		.then(function(service){

		});
}


module.exports = {


};
