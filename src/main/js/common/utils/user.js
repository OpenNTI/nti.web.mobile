import {getService, isFlag} from './';

const FLAG = 'obfuscate-usernames';

const SALT = '!@';


export function getDebugUsernameString (username) {
	if (!isFlag(FLAG)) {
		return void 0;
	}

	return username || 'unknown';
}

/**
 * URL encodes username (and if the site is configured to hide usernames, it obfuscates them too)
 *
 * @param {string} username The username to encode.
 *
 * @return {string} encoded username
 */
export function encode(username) {
	if (isFlag(FLAG)) {
		username = new Buffer(SALT + username)
			.toString('base64')
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
	}

	return encodeURIComponent(username);
}


/**
 * URL decode username (and if the site is configured to hide usernames,
 * its will be encoded per the method above, so decode that too so we can
 * reveal the username)
 *
 * @param {string} blob The string blog to decode.
 * @param {boolean} strict If true this will return NULL if the decoded string is not encoded by the encode method.
 *
 * @return {string} decoded username.
 */
export function decode (blob, strict) {
	let decoded = decodeURIComponent(blob);
	let str = decoded;

	if (isFlag(FLAG)) {

		// reverse to original encoding
		if (str.length % 4 !== 0) {
			str += ('===').slice(0, 4 - (str.length % 4));
		}

		str = str.replace(/-/g, '+').replace(/_/g, '/');
		str = new Buffer(str, 'base64').toString();

		//was it encoded by us?...
		str = SALT !== str.substr(0, SALT.length)
			//no ?abort,
			? (strict ? null : decoded)
			//or return the substring.
			: str.substr(SALT.length);
	}

	return str;
}


export function resolve (props, strict = false) {
	let {username, user, entity} = props;
	let promise;

	entity = entity || user;

	if (!username && !entity) {
		promise = Promise.reject('No Entity or no Username');
	}

	promise = promise || (entity && Promise.resolve(entity));

	if (!promise) {
		promise = getService()
			.then(service=>service.resolveUser(decode(username, strict)));
	}

	return promise;
}
