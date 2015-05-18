/* global $AppConfig */
import dataserver from 'nti.lib.interfaces';
import forceCurrentHost from 'nti.lib.interfaces/utils/forcehost';


function exposeGlobaly (...fns) {

	function wrap (fn) {
		return (...args)=> {
			console.error(`[DEBUG API ACCESSED (${fn.name})]: This message should only be seen when invoking this method on the REPL.`);
			return fn(...args);
		};
	}

	for (let fn of fns) {
		Object.assign(global, { [fn.name]: wrap(fn) });
	}
}


function noConfig() {
	return typeof $AppConfig === 'undefined';
}


export function getAppUsername () {
	if (noConfig()) {
		console.error('utils:getAppUsername() was called before config was defined.');
	}
	return $AppConfig.username;
}


export function getAppUser () {
	return getService().then(s=> s.getAppUser());
}


export function getBasePath () {
	if (noConfig()) {
		console.error('utils:getBasePath() was called before config was defined.');
	} else {
		console.error('[DEPRECATED] utils:getBasePath() is replaced with the BasePath Mixin');
	}
	return $AppConfig.basepath;
}


export function getServerURI () {
	if (noConfig()) {
		console.error('utils:getServerURI() was called before config was defined.');
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
	if (noConfig()) {
		console.error('utils:isFlag() was called before config was defined.');
	}
	let flags = $AppConfig.flags || {};
	return !!flags[flagName];
}


export function analyticsConfig () {
	return $AppConfig.analytics || {};
}


export function discussionsConfig () {
	return $AppConfig.discussions || {};
}


/**
 * @returns {Interface} the shared instance of the server interface.
 * NOTICE: This is for low-level (or anonymous/non-authenticated) work ONLY.
 */
export function getServer() {
	if (noConfig()) {
		console.error('utils:getServer() was called before config was defined.');
	}
	let fn = getServer;

	if (!fn.interface) {
		let s = $AppConfig.nodeInterface;
		if (!s) {
			let i = dataserver($AppConfig);

			s = i.interface;

			fn.datacache = i.datacache;
		}

		fn.interface = s;
	}
	return fn.interface;
}


/**
 * @returns {Promise} a promise that fulfills with the service descriptor.
 */
export function getService () {
	if (noConfig()) {
		console.error('utils:getService() was called before config was defined.');
	}
	return $AppConfig.nodeService ?
		Promise.resolve($AppConfig.nodeService) :
		getServer().getServiceDocument();
}


exposeGlobaly(getServer, getService);


export function installAnonymousService () {
	if (noConfig() || $AppConfig.nodeInterface) {
		return;
	}

	delete getServer.interface; //force any previous instances to get rebuilt.
	getServer();//(re)build instances

	//preset-cache to empty doc
	getServer.datacache.getForContext().set('service-doc', {Items: []});
}


export function overrideAppUsername (str) {
	if (noConfig()) {
		console.error('utils:overrideAppUsername() was called before config was defined.');
	}
	$AppConfig.username = str;
}

export function overrideConfigAndForceCurrentHost() {
	if (noConfig()) {
		console.error('utils:overrideConfigAndForceCurrentHost() was called before config was defined.');
	}
	$AppConfig.server = forceCurrentHost($AppConfig.server);
}
