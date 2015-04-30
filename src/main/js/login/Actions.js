import AppDispatcher from 'dispatcher/AppDispatcher';
import * as Constants from './Constants';

import {getServer} from 'common/utils';
import Store from './Store';
import * as MessageActions from 'messages/Actions';
import Message from 'messages/Message';

/**
 * Actions available to views for login-related functionality.
 */


export function begin () {
	AppDispatcher.handleViewAction({
		type: Constants.actions.LOGIN_BEGIN
	});
}

/**
 * Fired in response to user changes on the login form.
 */
export function userInputChanged (data) {
	console.log('LoginActions::userInputChanged');
	AppDispatcher.handleViewAction({
		type: Constants.events.LOGIN_FORM_CHANGED,
		credentials: (data && data.credentials)
	});
}

export function clearErrors () {
	AppDispatcher.handleViewAction({
		type: Constants.actions.LOGIN_CLEAR_ERRORS
	});
}

export function deleteTOS () {
	return getServer().deleteTOS();
}

/** Attempt a login using the provided credentials.
 * @param {Object} credentials The credentials to submit for authentication. Currently expects 'username' and 'password'.
 */
export function logIn (credentials) {
	AppDispatcher.handleViewAction({
		type: Constants.actions.LOGIN_PASSWORD,
		credentials: credentials
	});
}

/** Attempt an oauth login via the specified url
 * @param {String} the url to hit.
 */
export function logInOAuth (url) {
	AppDispatcher.handleViewAction({
		type: Constants.actions.LOGIN_OAUTH,
		url: url
	});
}

/** Log the out of the system. */
export function logOut () {
	AppDispatcher.handleViewAction({
		type: Constants.actions.LOGOUT
	});
}

/** dispatch a dataserver request to recover a user's password */
export function recoverPassword (fields) {
	return Store.getPasswordRecoveryReturnUrl().then(function(returnUrl) {
		return getServer().recoverPassword(fields.email, fields.username, returnUrl);
	});
}

export function resetPassword (fields) {

	let success = function(result) {
		Store.emitChange({
			type: Constants.events.PASSWORD_RESET_SUCCESSFUL,
			data: result
		});
	};

	let failure = function(reason) {
		MessageActions.clearMessages({category: Constants.messages.category});
		MessageActions.addMessage( new Message(reason.message, {category: Constants.messages.category}) );
		return reason;
	};

	return getServer().resetPassword(
		fields.username,
		fields.password,
		fields.token
	)
	.then(success, failure);
}

export function recoverUsername (fields) {
	return getServer().recoverUsername(fields.email);
}

export function setReturnPath (path) {
	Store.setReturnPath(path);
}
