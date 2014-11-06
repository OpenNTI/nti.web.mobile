/* global $AppConfig */
'use strict';
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
