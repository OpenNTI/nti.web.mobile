import Url from 'url';


import invariant from 'react/lib/invariant';
import {EventEmitter} from 'events';

import {IllegalArgumentException} from 'common/exceptions';
import AppDispatcher from 'dispatcher/AppDispatcher';
import * as MessagesActions from 'messages/Actions';
import Message from 'messages/Message';

import t from 'common/locale';
import {getServer, getServerURI, overrideAppUsername} from 'common/utils';

//TODO: Rewrite these constants
import {
	actions as ActionConstants,
	events as Events,
	links as Links,
	messages as LoginMessages
} from './Constants';

import StoreProperties from './StoreProperties';


let CHANGE_EVENT = 'change';
let links = {};
let isLoggedIn = false;
let returnPath;

//TODO: rewrite as the more-modern StoreEvents subclass
let LoginStore = Object.assign({}, EventEmitter.prototype, {
	Properties: StoreProperties,

	emitChange (evt) {
		this.emit(CHANGE_EVENT, evt);
	},


	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	},


	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	canDoPasswordLogin () {
		return (Links.LOGIN_PASSWORD_LINK in links);
	},

	getPasswordRecoveryReturnUrl () {
		//'https://ou-alpha.nextthought.com/login/passwordrecover.html?return=https://ou-alpha.nextthought.com/app/&username=ray.hatfield&id=2f36ca6e7a5f4c5b9f54cea84b3c8ca1';
		return Promise.resolve(Url.resolve(document.URL, '/login/passwordrecover.html'));
	},

	loginFormFields () {
		return [
			{
				ref: 'username',
				type: 'text',
				placeholder: t('LOGIN.UsernamePlaceholder')
			},
			{
				ref: 'password',
				type: 'password',
				placeholder: t('LOGIN.PasswordPlaceholder')
			}
		];
	},

	setReturnPath (path) {
		returnPath = path;
	},

	getReturnPath () {
		return returnPath;
	}

});


/**
 * Adds an error
 * @param {object} error object should include properties for statusCode (http status code) and raw (the raw response)
 * @return {void}
 */
function addError(error) {
	invariant(
		(error && 'statusCode' in error && 'raw' in error),
		'error should contain values for statusCode and raw; { statusCode:xxx, raw:{...} }'
	);
	let msg = t(LoginMessages.LOGIN_ERROR, error.statusCode.toString());
	let message = new Message(msg, {category: LoginMessages.category, error: error});
	MessagesActions.addMessage(message);

}

function LoginStoreChangeEvent(prop, val, oldval) {
	if (!(prop in StoreProperties)) {
		throw new IllegalArgumentException('"' + prop + '" is not a property defined in StoreProperties.');
	}
	this.property = prop;
	this.value = val;
	this.oldValue = oldval;
}

function setLinks(newLinks) {
	let oldVal = links;
	links = newLinks || {};
	LoginStore.emitChange(
		new LoginStoreChangeEvent(StoreProperties.links, links, oldVal)
	);
}

function ping(credentials) {
	function resp(res) { setLinks(res.links || {}); }

	let username = (credentials && credentials.username);
	getServer().ping(null, username)
		.then(resp, resp)
		.catch(r=> console.error(r));
}

function setLoggedIn(state) {
	console.log('LoginStore::setLoggedIn: %s', state);
	// emit a change event if the new value is different.
	if (isLoggedIn !== (isLoggedIn = state)) {
		LoginStore.emitChange(
			new LoginStoreChangeEvent(StoreProperties.isLoggedIn,
				isLoggedIn,
				!isLoggedIn
			)
		);
	}
	return isLoggedIn;
}

function logIn(credentials) {
//	LOGIN_LDAP_LINK: "logon.ldap.okstate",
//	LOGIN_LDAP_LINK: "logon.ldap.ou",

	let url = links[Links.LOGIN_PASSWORD_LINK];
	// prefer the LDAP link if available.
	for (let k of Object.keys(links)) {
		if((/logon\.ldap\./).test(k)) {
			url = links[k];
			console.debug('Found rel: "%s", using.', k);
		}
	}


	let p = getServer().logInPassword(
			url,
			credentials);

	p.then(function(r) {
		overrideAppUsername(credentials.username);
		console.log('login attempt resolved. %O', r);
		setLoggedIn(true);
	});
	p.catch(function(r) {
		console.log('login attempt rejected. %O', r);
		addError({
			statusCode: r.status || r.statusCode,
			raw: r
		});
	});
}

function logOut() {
	//TODO: this link doesn't need to be built, (we just need to append the
	//success to the rel="logout" link in the ping...which we should store on
	// a successfull handshake.)
	let p = getServerURI() + Links.LOGOUT_LINK + '?success=/mobile/login/';
	location.replace(p);
}

function clearErrors() {
	MessagesActions.clearMessages(null, LoginMessages.category);
}


AppDispatcher.register(function(payload) {
	let action = payload.action;

	switch (action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case ActionConstants.LOGIN_BEGIN:
			ping();
		break;

		case Events.LOGIN_FORM_CHANGED:
			ping(action.credentials);
		break;

		case ActionConstants.LOGIN_PASSWORD:
			logIn(action.credentials);
		break;

		case ActionConstants.LOGOUT:
			logOut(action);
		break;

		case ActionConstants.LOGIN_CLEAR_ERRORS:
			clearErrors(action);
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default LoginStore;
