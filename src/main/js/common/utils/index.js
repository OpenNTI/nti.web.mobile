/* global $AppConfig */
import Logger from 'nti-util-logger';
import QueryString from 'query-string';
import dataserver from 'nti-lib-interfaces';
import forceCurrentHost from 'nti-lib-interfaces/lib/utils/forcehost';

const logger = Logger.get('common:utils');

function exposeGlobally (...fns) {

	function wrap (fn) {
		return (...args)=> {
			logger.error(`[DEBUG API ACCESSED (${fn.name})]: This message should only be seen when invoking this method on the REPL.`);
			return fn(...args);
		};
	}

	for (let fn of fns) {
		Object.assign(global, { [fn.name]: wrap(fn) });
	}
}


function noConfig () {
	return typeof global.$AppConfig === 'undefined';
}


export function getAppUsername () {
	if (noConfig()) {
		logger.error('utils:getAppUsername() was called before config was defined.');
	}
	return $AppConfig.username;
}


export function getAppUser () {
	return getService().then(s=> s.getAppUser());
}


export function getAppUserCommunities (excludeGroups) {
	return getAppUser().then(x => x.getCommunities(excludeGroups));
}


export function getBasePath () {
	if (noConfig()) {
		logger.error('utils:getBasePath() was called before config was defined.');
	} else {
		logger.error('[DEPRECATED] utils:getBasePath() is replaced with the BasePath Mixin');
	}
	return $AppConfig.basepath;
}


export function getReturnURL (forceUpdate = false) {
	let me = getReturnURL;

	if (!me.value || forceUpdate) {
		let loc = global.location || {};
		loc = (QueryString.parse(loc.search) || {}).return;
		if (loc) {
			me.value = loc;
		}
	}

	return me.value;
}
getReturnURL(); //capture the return on init.


export function getServerURI () {
	if (noConfig()) {
		logger.error('utils:getServerURI() was called before config was defined.');
	}
	return $AppConfig.server;
}


export function getSiteName () {
	//This can only return a value on the client, on the server it currently returns `undefined`.
	if (typeof $AppConfig !== 'undefined') {
		return $AppConfig.siteName || (global.location || {}).hostname || 'default';
	}
}

export function getUserAgreementURI () {
	return `${$AppConfig.basepath}api/user-agreement/view`;
}


export function isFlag (flagName) {
	if (noConfig()) {
		logger.error('utils:isFlag() was called before config was defined.');
		return false;
	}
	let site = getSiteName();
	let {flags = {}} = $AppConfig;

	flags = Object.assign({}, flags, flags[site] || {});

	return !!flags[flagName];
}


export function discussionsConfig () {
	return $AppConfig.discussions || {};
}


export function externalLibraries () {
	return $AppConfig['external-libraries'];
}


/**
 * @returns {Interface} the shared instance of the server interface.
 * NOTICE: This is for low-level (or anonymous/non-authenticated) work ONLY.
 */
export function getServer () {
	if (noConfig()) {
		logger.error('utils:getServer() was called before config was defined.');
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
		logger.error('utils:getService() was called before config was defined.');
	}
	return $AppConfig.nodeService ?
		Promise.resolve($AppConfig.nodeService) :
		getServer().getServiceDocument();
}


exposeGlobally(getServer, getService);


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
		logger.error('utils:overrideAppUsername() was called before config was defined.');
	}
	$AppConfig.username = str;
}


export function overrideConfigAndForceCurrentHost () {
	if (noConfig()) {
		logger.error('utils:overrideConfigAndForceCurrentHost() was called before config was defined.');
	}
	$AppConfig.server = forceCurrentHost($AppConfig.server);
}
