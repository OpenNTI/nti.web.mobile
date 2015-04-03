/* global $AppConfig */

import forceCurrentHost from 'nti.lib.interfaces/utils/forcehost';


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
		console.error('[DEPRECATED] utils:getBasePath() is replaced with the BasePath Mixin');
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
	let flags = $AppConfig.flags || {};
	return !!flags[flagName];
}

export function analyticsConfig () {
	return $AppConfig.analytics||{};
}

export function discussionsConfig () {
	return $AppConfig.discussions||{};
}

/**
 * Returns the shared instance of the server interface.
 * NOTICE: This is for low-level (or anonymous/non-authenticated) work ONLY.
 */
export function getServer() {
	if (isNode()) {
		console.error('utils:getServer() was called in global scope.');
	}
	let fn = getServer;
	if (!fn.server) {
		fn.server = $AppConfig.nodeInterface ||
			require('nti.lib.interfaces').default($AppConfig).interface;
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


export function overrideAppUsername (str) {
	if (isNode()) {
		console.error('utils:overrideAppUsername() was called in global scope.');
	}
	$AppConfig.username = str;
}

export function overrideConfigAndForceCurrentHost(){
	if (isNode()) {
		console.error('utils:overrideConfigAndForceCurrentHost() was called in global scope.');
	}
	$AppConfig.server = forceCurrentHost($AppConfig.server);
}
