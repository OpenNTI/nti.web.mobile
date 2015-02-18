/* global $AppConfig */

import forceCurrentHost from 'dataserverinterface/utils/forcehost';


function isNode() {
	return typeof $AppConfig === 'undefined' && typeof global.process !== 'undefined';
}


export function getAppUsername () {
	if (isNode()) {
		console.error('utils:getAppUsername() was called in global scope.');
	}
	return $AppConfig.username;
}


export function getBasePath () {
	if (isNode()) {
		console.error('utils:getBasePath() was called in global scope.');
	} else {
		console.debug('[DEPRECATED] utils:getBasePath() is replaced with the BasePath Mixin');
	}
	return $AppConfig.basepath;
}


export function getServerURI () {
	if (isNode()) {
		console.error('utils:getServerURI() was called in global scope.');
	}
	return $AppConfig.server;
}


export function getSiteName () {
	//This can only return a value on the client, on the server it currently returns `undefined`.
	if (typeof $AppConfig !== 'undefined') {
		return $AppConfig.siteName || location.hostname;
	}
}


export function isFlag (flagName) {
	if (isNode()) {
		console.error('utils:isFlag() was called in global scope.');
	}
	var flags = $AppConfig.flags || {};
	return !!flags[flagName];
}

/**
 * Returns the shared instance of the server interface.
 * NOTICE: This is for low-level (or anonymous/non-authenticated) work ONLY.
 */
export function getServer() {
	if (isNode()) {
		console.error('utils:getServer() was called in global scope.');
	}
	var fn = getServer;
	if (!fn.server) {
		fn.server = $AppConfig.nodeInterface ||
			require('dataserverinterface').default($AppConfig).interface;
	}
	return fn.server;
}


/**
 * Returns a promise that fulfills with the service descriptor.
 */
export function getService () {
	if (isNode()) {
		console.error('utils:getService() was called in global scope.');
	}
	return $AppConfig.nodeService || getServer().getServiceDocument();
}


export function __setUsername (str) {
	if (isNode()) {
		console.error('utils:__setUsername() was called in global scope.');
	}
	$AppConfig.username = str;
}

export function __forceCurrentHost(){
	if (isNode()) {
		console.error('utils:__forceCurrentHost() was called in global scope.');
	}
	$AppConfig.server = forceCurrentHost($AppConfig.server);
}
