/* global $AppConfig */
'use strict';

var defineHidden = require('dataserverinterface/utils/object-define-hidden-props');
var forceCurrentHost = require('dataserverinterface/utils/forcehost');


function isNode() {
	return typeof $AppConfig === 'undefined' && typeof global.process !== 'undefined';
}

/**
 * @class Utils
 */
var Utils = {

	getAppUsername: function() {
		if (isNode()) {
			console.error('Utils.getAppUsername() was called in global scope.');
		}
		return $AppConfig.username;
	},


	getBasePath: function() {
		if (isNode()) {
			console.error('Utils.getBasePath() was called in global scope.');
		} else {
			console.debug('[DEPRECATED] Utils.getBasePath() is replaced with the BasePath Mixin');
		}
		return $AppConfig.basepath;
	},


	getServerURI: function () {
		if (isNode()) {
			console.error('Utils.getServerURI() was called in global scope.');
		}
		return $AppConfig.server;
	},


	getSiteName: function () {
		//This can only return a value on the client, on the server it currently returns `undefined`.
		if (typeof $AppConfig !== 'undefined') {
			return $AppConfig.siteName || location.hostname;
		}
	},


	isFlag: function(flagName) {
		if (isNode()) {
			console.error('Utils.isFlag() was called in global scope.');
		}
		var flags = $AppConfig.flags || {};
		return !!flags[flagName];
	},


	/**
	 * Returns the shared instance of the server interface.
	 * NOTICE: This is for low-level (or anonymous/non-authenticated) work ONLY.
	 */
	getServer: function getServer() {
		if (isNode()) {
			console.error('Utils.getServer() was called in global scope.');
		}
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
		if (isNode()) {
			console.error('Utils.getService() was called in global scope.');
		}
		return $AppConfig.nodeService || Utils.getServer().getServiceDocument();
	},



	Viewport: require('./_utils.viewport'),


	Dom: require('./_utils.dom'),


	Orientation: require('./_utils.orientation'),


	VisibilityMonitor: require('./_utils.pagevis'),


	AppCache: require('./_utils.appcache')
};

module.exports = Utils;


//This is down at the bottom to hide
defineHidden(Utils, {
	__setUsername: function(str) {
		if (isNode()) {
			console.error('Utils.__setUsername() was called in global scope.');
		}
		$AppConfig.username = str;
	},

	__forceCurrentHost: function(){
		if (isNode()) {
			console.error('Utils.__forceCurrentHost() was called in global scope.');
		}
		$AppConfig.server = forceCurrentHost($AppConfig.server);
	}
});
