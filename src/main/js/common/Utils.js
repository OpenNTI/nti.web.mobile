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
	 * Returns a promise that fulfills with the service descriptor.
	 */
	getService: function() {
		return Utils.getServer().getServiceDocument();
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
	},


	Dom: require('./_utils.dom'),


	Orientation: require('./_utils.orientation')
}

module.exports = Utils;
