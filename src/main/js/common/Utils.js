"use strict";
/**
* @class Utils
*/
var Utils = {

	/**
	 * Returns the shared instance of the server interface.
	 */
	getServer: function getServer() {
		var fn = getServer;
		if (!fn.server) {
			fn.server = require('dataserverinterface')($AppConfig).interface;
		}
		return fn.server;
	},


	/**
	 * TODO: migrate calls to this to use dataserverinterface.service[get|post|etc...]
	 *
	 * Make a server request.
	 * @method call
	 * @param url {String} The url to request
	 * @param data {mixed} An object or query string to submit as part of the request
	 * @param callback {function} The function to invoke upon request completion
	 * @param forceMethod {String} Force the request to use this method (e.g. 'GET' or 'POST')
	 */
	call: function(url,data,callback,forceMethod) {
		console.warn('Deprecated: we should make all requests through the dataserver interface');
		var username = data? data.username : undefined,
			password = data? data.password : undefined,
			auth = password? ('Basic '+btoa(username+':'+password)) : undefined,
			m = forceMethod? forceMethod : data? 'POST':'GET',
			l = url,/* + "?dc="+(new Date().getTime()),*/
			f = { withCredentials: true },
			h = {
				Accept:'application/json',
				Authorization:auth,
				'Content-Type':'application/x-www-form-urlencoded'
			};

		if(!auth){ delete h.Authorization; f = {}; }
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
			if(callback){ callback.call(window, jqXHR.status ); }
		}).done(function(data){
			if(callback){ callback.call(window, data || x.status ); }
		});
	},


	/**
	 * Serializes an object to be submitted as part of an web/ajax request.
	 * @method toQueryString
	 * @param {Object} obj The object to serialize.
	 * @return {String} Serialized, URI-encoded, querystring form of the given object.
	 */
	toQueryString: function(obj) {
		var k, t,string = [];
		for(k in o){
			if(o.hasOwnProperty(k)){
				t = typeof o[k];
				if(t==='string' || t==='boolean' || t==='number') {
					string.push([encodeURIComponent(k),encodeURIComponent(o[k])].join('='));
				} else {
					console.log(typeof o[k], k, o[k]);
				}
			}
		}
		return string.join('&');
	},


	/*
	 * Maps the given object array, indexed by element[key].
	 * Example:
	 * var in = [{name:'banana', color:'yellow'}, {name:'apple', color:'red'}];
	 * Utils.indexArrayByKey(in,'name') returns:
	 * {
	 * 	'banana': {name:'banana', color:'yellow'},
	 * 	'apple': {name:'apple', color:'red'}
	 * }
	 * Note: No attempt is made to prevent items with
	 * the same key from stomping each other.
	 */
	indexArrayByKey: function(arr, key) {
		var result = {};
		arr.forEach(function(item) {
			result[item[key]] = item;
		});
		return result;
	}
}

module.exports = Utils;
