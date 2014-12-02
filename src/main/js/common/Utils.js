/* global $AppConfig */
'use strict';

var defineHidden = require('dataserverinterface/utils/object-define-hidden-props');
var forceCurrentHost = require('dataserverinterface/utils/forcehost');

/**
 * @class Utils
 */
var Utils = {

	getAppUsername: function() {
		return $AppConfig.username;
	},


	getBasePath: function() {
		return $AppConfig.basepath;
	},


	getServerURI: function () {
		return $AppConfig.server;
	},


	getSiteName: function () {
		//This can only return a value on the client, on the server it currently returns `undefined`.
		if (typeof $AppConfig !== 'undefined') {
			return $AppConfig.siteName || location.hostname;
		}
	},


	isFlag: function(flagName) {
		var flags = $AppConfig.flags || {};
		return !!flags[flagName];
	},


	/**
	 * Returns the shared instance of the server interface.
	 * NOTICE: This is for low-level (or anonymous/non-authenticated) work ONLY.
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


//This is down at the bottom to hide
defineHidden(Utils, {
	__setUsername: function(str) {$AppConfig.username = str;},
	__forceCurrentHost: function(){$AppConfig.server = forceCurrentHost($AppConfig.server);}
});
