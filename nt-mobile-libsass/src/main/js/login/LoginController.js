/*
 * LoginController
 */
'use strict';

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var LoginConstants = require('./LoginConstants');
var Utils = require('../common/Utils');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

function ping() {
	console.log('ping');
	call('/dataserver2/logon.ping',null,pong);
}

function pong(o) {
	console.log('pong');
	var link = Utils.getLink(o,'logon.handshake');
	console.log(link);
	debugger;
}

function call(url,data,back,forceMethod) {
	var u = data? data.username : undefined,
		p = data? data.password : undefined,
		a = p? ('Basic '+btoa(u+':'+p)) : undefined,
		m = forceMethod? forceMethod : data? 'POST':'GET',
		l = url,/* + "?dc="+(new Date().getTime()),*/
		f = { withCredentials: true },
		h = {
			Accept:'application/json',
			Authorization:a,
			'Content-Type':'application/x-www-form-urlencoded'
		};

	if(!a){ delete h.Authorization; f = {}; }
	if(!data) { delete h['Content-Type']; }

	if (m === 'GET' && data){
		delete data.password;
		delete data.remember;
		delete data.username;
	}

	var x = $.ajax({
		xhrFields: f,
		url: l,
		type: m,
		headers: h,
		data: data,
		dataType: 'json'
	}).fail(function(jqXHR, textStatus){
		//console.error('The request failed. Server up? CORS?\nURL: '+l, textStatus, jqXHR.status);
		if(back){ back.call(window, jqXHR.status ); }
	}).done(function(data){
		if(back){ back.call(window, data || x.status ); }
	});
}

var LoginController = merge(EventEmitter.prototype, {

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {
		case LoginConstants.LOGIN_BEGIN:
				console.log("LoginController: LOGIN_BEGIN.");
				ping();
				LoginController.emitChange();
			break;

		default:
			return true;
	}

	return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = LoginController;
