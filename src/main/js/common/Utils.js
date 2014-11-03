/* global $AppConfig */
'use strict';
/**
 * @class Utils
 */
var Utils = {

	getAppUsername: function() {
		return $AppConfig.username;
	},


	/**
	 * Returns the shared instance of the server interface.
	 */
	getServer: function getServer() {
		var fn = getServer;
		if (!fn.server) {
			fn.server = $AppConfig.nodeInterface ||
			 	require('dataserverinterface')($AppConfig).interface;
		}
		return fn.server;
	},


	/**
	 * Returns a promise that fulfills with the service descriptor.
	 */
	getService: function() {
		return $AppConfig.nodeService || Utils.getServer().getServiceDocument();
	},


	/**
	 * Serializes an object to be submitted as part of an web/ajax request.
	 * @method toQueryString
	 * @param {Object} o The object to serialize.
	 * @return {String} Serialized, URI-encoded, querystring form of the given object.
	 */
	toQueryString: function(o) {
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


	fromQueryString: function(str) {
		var o = {};
		(str || '').split(/[\?&]/).forEach(function(v) {
			if (v && v.length) {
				v = v.split(/=/);
				o[v[0]] = decodeURIComponent(v[1]);
			}
		});
		return o;
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

	arrayUnion: function(arr1,arr2) {
		var keySet = arr1.concat(arr2).reduce(
			function(previousValue,currentValue) {
				if(previousValue.indexOf(currentValue) === -1) {
					previousValue.push(currentValue);
				}
				return previousValue;
			},[]);
		return keySet;
	},


	Viewport: {
		getHeight: function() {
			var el = document.documentElement || {};
			return window.innerHeight || el.clientHeight;
		},

		getWidth: function () {
			var el = document.documentElement || {};
			return window.innerWidth || el.clientWidth;
		},

		getScreenWidth: function() {
			var fallback = this.getWidth();
			return (global.screen || {}).width || fallback;
		},

		getScreenHeight: function() {
			var fallback = this.getHeight();
			return (global.screen || {}).height || fallback;
		}
	},


	Dom: require('./_utils.dom'),

	Orientation: require('./_utils.orientation'),

	VisibilityMonitor: require('./_utils.pagevis'),

	AppCache: require('./_utils.appcache')
};

module.exports = Utils;
