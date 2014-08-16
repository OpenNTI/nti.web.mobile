/*
 * LoginResponseHandlers
 */

"use strict";

var Utils = require('../common/Utils');
var LoginConstants = require('./LoginConstants');

var LoginResponseHandlers = merge(EventEmitter.prototype, {
	// pong: function(response) {
	// 	console.log('LoginResponseHandlers::pong');
	// 	var handshakeLink = Utils.getLink(response, LoginConstants.HANDSHAKE);
	// 	if(response && response.hasOwnProperty('Links')) {

	// 		// index the links by their rel attr
	// 		var links_by_rel = Utils.indexArrayByKey(response['Links'],'rel');

	// 		this.emit(LoginConstants.LOGIN_LINKS_CHANGED,links_by_rel);
	// 	}
	// },

	// handshake: function(response) {
		
	// }

};

module.exports = LoginResponseHandlers;
