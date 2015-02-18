'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;
var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');
var {getService} = require('common/utils');
var getLink = require('dataserverinterface/utils/getlink');

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'enrollment.Store',

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	emitError: function(event) {
		this.emitChange(Object.assign({isError: true}, event));
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

});

/**
* Fetch a link with the given rel.
*/
function _fetchLink(linkRel) {

	var me = _fetchLink;

	if (!me.promises) {
		me.promises = {};
	}

	if (me.promises[linkRel]) {
		console.debug('returning cached fetchLink promise for %s', linkRel);
		return me.promises[linkRel];
	}

	var service = getService();

	var getUser = service.then(
		function(service) {
			return service.getAppUser();
		}
	);

	var getHref = getUser.then(
		function(user) {
			return getLink(user, linkRel);
		}
	);

	var promise = getHref.then(
		function(href) {
			return service.then(function(service) {
				return service.get(href);
			}
		);
	});

	console.debug('caching resolved fetchLink promise for %s', linkRel);
	me.promises[linkRel] = promise;

	promise.catch(function(/*reason*/) {
		delete me.promises[linkRel];
	});

	return promise;
}

Store.appDispatch = AppDispatcher.register(function(data) {
    var action = data.action;

    switch(action.type) {
    //TODO: remove all switch statements, replace with functional object literals. No new switch statements.
    	/**
    	* FETCH_LINK action is used to populate select options
    	* from remote sources, e.g. state and country lists in
    	* RelatedFormPanel.
    	*/
		case Constants.FETCH_LINK:
			var data = action.payload;
			_fetchLink(data.link).then(
				function(response) {
					Store.emitChange({
						type: Constants.URL_RETRIEVED,
						action: action,
						response: response
					});
				},
				function(reason) {
					Store.emitError({
						url: data.url,
						reason: reason
					});
					Promise.reject(reason);
				}
			);
			break;

        default:
            return true;
    }
    return true;
});


module.exports = Store;
