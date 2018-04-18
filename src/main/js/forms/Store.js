//TODO: Cleanup/Rewrite -- this was only translated to ES6, it is still in need of updating.
import EventEmitter from 'events';

import AppDispatcher from '@nti/lib-dispatcher';
import {CHANGE_EVENT} from '@nti/lib-store';
import {getService} from '@nti/web-client';

import * as Constants from './Constants';

class Store extends EventEmitter {

	emitChange (evt) {
		this.emit(CHANGE_EVENT, evt);
	}

	emitError (event) {
		this.emitChange(Object.assign({isError: true}, event));
	}

	/**
	 * @param {function} callback Event Handler
	 * @returns {void}
	 */
	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	}

	/**
	 * @param {function} callback Event Handler
	 * @returns {void}
	 */
	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

}

/**
* Fetch a link with the given rel.
* @param {string} linkRel link to fetch
* @returns {Promise} response promise.
*/
function fetchLink (linkRel) {

	let me = fetchLink;

	if (!me.promises) {
		me.promises = {};
	}

	if (me.promises[linkRel]) {
		return me.promises[linkRel];
	}

	let servicePromise = getService();

	let getUser = servicePromise.then(service=> service.getAppUser());

	let getHref = getUser.then(user=>user.getLink(linkRel));

	let promise = getHref.then(href => servicePromise.then(service=>service.get(href)));

	me.promises[linkRel] = promise;

	promise.catch((/*reason*/)=> delete me.promises[linkRel]);

	return promise;
}

let store = new Store();

Store.appDispatch = AppDispatcher.register(data => {
	let {action} = data;

	switch(action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
	/**
	* FETCH_LINK action is used to populate select options
	* from remote sources, e.g. state and country lists in
	* RelatedFormPanel.
	*/
	case Constants.FETCH_LINK: {
		let {payload} = action;
		fetchLink(payload.link).then(
			response =>
				store.emitChange({ type: Constants.URL_RETRIEVED, action, response }),
			reason => {
				store.emitError({
					url: payload.url,
					reason: reason
				});
				Promise.reject(reason);
			});
		break;
	}

	default:
		return true;
	}
	return true;
});


export default store;
