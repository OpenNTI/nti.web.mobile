'use strict';

var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const version = '3.6.0';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version;
const _hasatob = typeof atob === 'function';
const _hasbtoa = typeof btoa === 'function';
const _hasBuffer = typeof Buffer === 'function';
const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const b64chs = [...b64ch];
const b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
})(b64chs);
const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
const _fromCC = String.fromCharCode.bind(String);
const _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (it, fn = (x) => x) => new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
const _mkUriSafe = (src) => src
    .replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_')
    .replace(/=+$/m, '');
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill = (bin) => {
    // console.log('polyfilled');
    let u32, c0, c1, c2, asc = '';
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError('invalid character found');
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc += b64chs[u32 >> 18 & 63]
            + b64chs[u32 >> 12 & 63]
            + b64chs[u32 >> 6 & 63]
            + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = _hasbtoa ? (bin) => btoa(bin)
    : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
        : btoaPolyfill;
const _fromUint8Array = _hasBuffer
    ? (u8a) => Buffer.from(u8a).toString('base64')
    : (u8a) => {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        const maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const utob = (src: string) => unescape(encodeURIComponent(src));
// reverting good old fationed regexp
const cb_utob = (c) => {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                + _fromCC(0x80 | (cc & 0x3f)))
                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                    + _fromCC(0x80 | (cc & 0x3f)));
    }
    else {
        var cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
            + _fromCC(0x80 | (cc & 0x3f)));
    }
};
const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (u) => u.replace(re_utob, cb_utob);
//
const _encode = _hasBuffer
    ? (s) => Buffer.from(s, 'utf8').toString('base64')
    : _TE
        ? (s) => _fromUint8Array(_TE.encode(s))
        : (s) => _btoa(utob(s));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode = (src, urlsafe = false) => urlsafe
    ? _mkUriSafe(_encode(src))
    : _encode(src);
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
const encodeURI = (src) => encode(src, true);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const btou = (src: string) => decodeURIComponent(escape(src));
// reverting good old fationed regexp
const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
const cb_btou = (cccc) => {
    switch (cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                | ((0x3f & cccc.charCodeAt(1)) << 12)
                | ((0x3f & cccc.charCodeAt(2)) << 6)
                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
            return (_fromCC((offset >>> 10) + 0xD800)
                + _fromCC((offset & 0x3FF) + 0xDC00));
        case 3:
            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                | (0x3f & cccc.charCodeAt(2)));
        default:
            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                | (0x3f & cccc.charCodeAt(1)));
    }
};
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (b) => b.replace(re_btou, cb_btou);
/**
 * polyfill version of `atob`
 */
const atobPolyfill = (asc) => {
    // console.log('polyfilled');
    asc = asc.replace(/\s+/g, '');
    if (!b64re.test(asc))
        throw new TypeError('malformed base64.');
    asc += '=='.slice(2 - (asc.length & 3));
    let u24, bin = '', r1, r2;
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18
            | b64tab[asc.charAt(i++)] << 12
            | (r1 = b64tab[asc.charAt(i++)]) << 6
            | (r2 = b64tab[asc.charAt(i++)]);
        bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
            : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
};
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob = _hasatob ? (asc) => atob(_tidyB64(asc))
    : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
        : atobPolyfill;
//
const _toUint8Array = _hasBuffer
    ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
    : (a) => _U8Afrom(_atob(a), c => c.charCodeAt(0));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = (a) => _toUint8Array(_unURI(a));
//
const _decode = _hasBuffer
    ? (a) => Buffer.from(a, 'base64').toString('utf8')
    : _TD
        ? (a) => _TD.decode(_toUint8Array(a))
        : (a) => btou(_atob(a));
const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode = (src) => _decode(_unURI(src));
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
  */
const isValid = (src) => {
    if (typeof src !== 'string')
        return false;
    const s = src.replace(/\s+/g, '').replace(/=+$/, '');
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
//
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
/**
 * extend String.prototype with relevant methods
 */
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add('fromBase64', function () { return decode(this); });
    _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
    _add('toBase64URI', function () { return encode(this, true); });
    _add('toBase64URL', function () { return encode(this, true); });
    _add('toUint8Array', function () { return toUint8Array(this); });
};
/**
 * extend Uint8Array.prototype with relevant methods
 */
const extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
    _add('toBase64URI', function () { return fromUint8Array(this, true); });
    _add('toBase64URL', function () { return fromUint8Array(this, true); });
};
/**
 * extend Builtin prototypes with relevant methods
 */
const extendBuiltins = () => {
    extendString();
    extendUint8Array();
};
const gBase64 = {
    version: version,
    VERSION: VERSION,
    atob: _atob,
    atobPolyfill: atobPolyfill,
    btoa: _btoa,
    btoaPolyfill: btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode: encode,
    encodeURI: encodeURI,
    encodeURL: encodeURI,
    utob: utob,
    btou: btou,
    decode: decode,
    isValid: isValid,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins,
};

const COMMON_PREFIX = 'tag:nextthought.com,2011-10:';

/**
 * Parses an id and returns an object containing the split portions
 * See http://excelsior.nextthought.com/server-docs/ntiid-structure/
 *
 * @param {string} id ntiid
 * @returns {Object} an object containing the components of the id
 */
function parseNTIID(id) {
	let parts = (typeof id !== 'string' ? (id || '').toString() : id).split(
			':'
		),
		authority,
		specific,
		result = {};

	if (parts.length < 3 || parts[0] !== 'tag') {
		//console.warn('"'+id+'" is not an NTIID');
		return null;
	}

	//First part is tag, second is authority, third is specific portion

	//authority gets split by comma into name and date
	authority = parts[1].split(',');
	if (authority.length !== 2) {
		//invalid authority chunk
		return null;
	}

	result.authority = {
		name: authority[0],
		date: authority[1],
	};

	//join any parts after the 2nd into the specific portion that will
	//then be split back out into the specific parts.
	//TODO yank the fragment off the end
	specific = parts.slice(2).join(':');
	specific = specific.split('-');

	result.specific = {
		type: specific.length === 3 ? specific[1] : specific[0],
		typeSpecific: specific.length === 3 ? specific[2] : specific[1],
	};

	//Define a setter on provider property so we can match the ds escaping of '-' to '_'
	Object.defineProperty(result.specific, 'provider', {
		get() {
			return this.$$provider;
		},
		set(p) {
			if (p && p.replace) {
				p = p.replace(/-/g, '_');
			}
			this.$$provider = p;
		},
	});

	result.specific.provider = specific.length === 3 ? specific[0] : null;

	result.toString = function () {
		let m = this,
			a = [m.authority.name, m.authority.date],
			s = [m.specific.provider, m.specific.type, m.specific.typeSpecific];
		if (!m.specific.provider) {
			s.splice(0, 1);
		}

		return ['tag', a.join(','), s.join('-')].join(':');
	};

	//FIXME include authority?
	result.toURLSuffix = function () {
		//#!html/mathcounts/mathcounts2013.warm_up_7
		let m = this,
			components = [];

		components.push(m.specific.type);
		if (m.specific.provider) {
			components.push(m.specific.provider);
		}
		components.push(m.specific.typeSpecific);

		return '#!' + components.map(encodeURIComponent).join('/');
	};

	return result;
}

function isNTIID(id) {
	return Boolean(parseNTIID(id));
}

encodeForURI.sloppy = id => encodeForURI(id, false);
function encodeForURI(ntiid, strict = true) {
	const { length: cut } = COMMON_PREFIX;

	if (ntiid && ntiid.substr(0, cut) === COMMON_PREFIX) {
		ntiid = ntiid.substr(cut);
	} else if (!isNTIID(ntiid) && strict) {
		throw new Error('Invalid NTIID');
	}

	return encodeURIComponent(ntiid);
}

function decodeFromURI(component) {
	if (typeof component !== 'string' || !component) {
		return null;
	}

	let ntiid = decodeURIComponent(component);

	if (!isNTIID(ntiid) && ntiid.substr(0, 3) !== 'tag' && ntiid.length > 0) {
		ntiid = COMMON_PREFIX + ntiid;
	}

	return ntiid;
}

/*eslint strict:0, import/no-commonjs:0, import/order:0*/

const SEGMENT_HANDLERS = {
	redeem: (catalogId, segments) =>
		path__default['default'].join('catalog', 'redeem', catalogId, segments[1]),

	forcredit: catalogId =>
		// catalog/enroll/apply/NTI-CourseInfo-Summer2015_LSTD_1153_Block_C/
		path__default['default'].join('catalog', 'enroll', 'apply', catalogId, '/'),

	[null]: catalogId => path__default['default'].join('catalog', 'item', catalogId),
};

const HANDLERS = {
	handleObjectRedirects: /\/(id|ntiid|object)\//i,
	handleInvitationRedirects: /(invitations\/accept)|(catalog\/redeem)/i,
	handleLibraryRedirects: /^library/i,
	handleProfileRedirects: /\/(user|group)/i,
	//the path may not always start with /app/ but it will always be have one path segment in front.
	handleLibraryPathRedirects: /^\/[^/]+\/library/i,
	handleCatalogPathRedirects: /^\/[^/]+\/catalog\//i,
	handleBundlePathRedirect: /^\/[^/]+\/bundle/i,
	handleCommunityPathRedirect: /^\/[^/]+\/community/i,
};

class Redirects {
	constructor(express, config) {
		this.basepath = config.basepath;

		express.use((req, res, next) => {
			// the query (q) is deprecated, but
			// if its present, it trumps the path (p)
			let redirectParam = req.query.q || req.query.p;
			let redirectFragment = req.query.f;
			if (!redirectParam) {
				return next();
			}

			// console.debug('TESTING FOR REDIRECT: ', redirectParam);

			for (let handlerName of Object.keys(HANDLERS)) {
				let test = HANDLERS[handlerName];
				if (redirectParam.match(test)) {
					return this[handlerName](
						redirectParam,
						res,
						next,
						redirectFragment
					);
				}
			}

			return res.redirect(this.basepath);
		});
	}

	handleProfileRedirects(query, res, next) {
		/*
		 *	from:
		 *	/app/user/me/...
		 *
		 *	to:
		 *	/mobile/profile/<user>/...
		 */

		const pattern = /\/(?:user|group)\/(.*)/;
		const [, rest] = query.match(pattern) || [];

		if (!rest) {
			return next();
		}

		const url = path__default['default'].join(this.basepath, 'profile', rest);
		// console.debug('redirecting to: %s', url);
		res.redirect(url);
	}

	handleInvitationRedirects(query, res, next) {
		/*
		 *	from:
		 *	library/courses/available/invitations/accept/<token>
		 *	or:
		 *	/app/catalog/redeem/<token>
		 *
		 *	to:
		 *	<basepath>/catalog/code/<token>
		 */

		// [full match, token]
		let parts = query.match(/(?:accept|redeem)\/([^/]*)/);
		if (parts) {
			let url = path__default['default'].join(this.basepath, 'catalog', 'redeem', parts[1]);
			// console.debug('redirecting to: %s', url);
			res.redirect(url);
			return;
		}

		next();
	}

	handleCatalogPathRedirects(query, res, next) {
		/* From:
		 *  /app/catalog/...
		 *
		 * To:
		 *  <basepath>/catalog/...
		 */
		const pattern = /catalog\/(.*)/;
		let [, route] = query.match(pattern) || [];

		const url = path__default['default'].join(this.basepath, 'catalog', route);
		res.redirect(url);
	}

	handleLibraryPathRedirects(query, res, next) {
		/* From:
		 * /app/library/courses/available/NTI-CourseInfo-iLed_iLed_001/...
		 *
		 * To:
		 * <basepath>/catalog/item/NTI-CourseInfo-iLed_iLed_001/...
		 */

		let pattern = /library\/courses\/available\/(.*)/;
		let parts = query.match(pattern);
		if (parts) {
			let url = path__default['default'].join(this.basepath, 'catalog', 'item', parts[1]);
			// console.debug('redirecting to: %s', url);
			res.redirect(url);
			return;
		}

		next();
	}

	handleLibraryRedirects(query, res, next) {
		let url = query;
		let catalog = /library\/availablecourses\/([^/]*)\/?(.*)/;

		/* From:
		 * ?q=library/availablecourses/IUB0YWc6bmV4dHRob3VnaHQuY29tLDIwMTEtMTA6TlRJLUNvdXJzZUluZm8tU3ByaW5nMjAxNV9MU1REXzExNTM/redeem/code
		 *
		 * To:
		 * <basepath>/catalog/item/NTI-CourseInfo-Spring2015_LSTD_1153/enrollment/store/gift/redeem/code
		 */

		// [full match, catalog item id (encoded), trailing path]
		let parts = url.match(catalog);
		if (parts) {
			let catalogId = translateCatalogId(parts[1]);
			let trailingPath = translatePath(catalogId, parts[2]) || '';

			url = path__default['default'].join(this.basepath, trailingPath);

			// console.debug('redirecting to: %s', url);
			res.redirect(url);
			return;
		}

		next();
	}

	handleBundlePathRedirect(query, res, next, fragment) {
		const partMap = {
			app: '',
			bundle: 'content',
			content: 'page',
			notebook: 'n',
		};

		const fixed = query
			.split('/')
			.map(part => (partMap[part] == null ? part : partMap[part]))
			.filter(Boolean);

		let url = path__default['default'].join(this.basepath, ...fixed);

		if (fragment) {
			url = `${url}#${fragment}`;
		}

		res.redirect(url);
	}

	handleCommunityPathRedirect(query, res, next) {
		const partMap = {
			app: '',
		};

		const fixed = query
			.split('/')
			.map(part => (partMap[part] == null ? part : partMap[part]))
			.filter(Boolean);

		res.redirect(path__default['default'].join(this.basepath, ...fixed));
	}

	handleObjectRedirects(query, res, next) {
		/* From:
		 *	/app/id/unknown-OID-0x021cae18:5573657273:V0wWNR9EBJd
		 *	object/ntiid/tag:nextthought.com,2011-10:unknown-OID-0x021cae18:5573657273:V0wWNR9EBJd
		 *
		 * To:
		 * 	<basepath>/object/unknown-OID-0x021cae18:5573657273:V0wWNR9EBJd
		 */

		// console.debug('\n\n\nTesting %s\n\n\n', query);
		let object = /(?:(?:id|object\/ntiid|object)\/)([^/\n\r]*)\/?(.*)/;
		let match = decodeURIComponent(query).match(object);

		if (match) {
			let [, ntiid] = match;

			let url = path__default['default'].join(
				this.basepath,
				'object',
				encodeForURI(decodeFromURI(ntiid))
			);

			// console.debug('redirecting to: %s', url);
			res.redirect(url);
			return;
		}

		next();
	}
}

function translatePath(catalogId, trailingPath) {
	let segments = (trailingPath || '').split('/');

	let handler = SEGMENT_HANDLERS[segments[0] || null];

	return handler.call(null, catalogId, segments);
}

function translateCatalogId(input) {
	let catalogId = input.replace(/-/g, '+').replace(/_/g, '/');

	catalogId = gBase64.decode(catalogId);
	catalogId = catalogId.replace(/^!@/, ''); //strip off the WebApp's 'salt'
	catalogId = encodeForURI(catalogId);

	return catalogId;
}

function register(express, config) {
	return new Redirects(express, config);
}

exports.register = register;
