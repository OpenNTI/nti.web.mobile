'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var RelatedFormStore = require('common/forms/RelatedFormStore');
var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;
var AppDispatcher = require('dispatcher/AppDispatcher');
var Constants = require('./Constants');
var Utils = require('common/Utils');

var _storeContextId;

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'enrollment.Store',

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
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
	},

	getFormStoreContextId: function(shouldCreate) {
		if(!_storeContextId && shouldCreate) {
			_storeContextId = RelatedFormStore.newContext();
		}
		return _storeContextId;
	},

	getAdmissionStatus: function() {
		var me = this.getAdmissionStatus;
		if(!me.promise) {
			me.promise = _getFiveMinuteService().then(function(service) {
				return service.getAdmissionStatus();
			});
		}
		return me.promise;
	}

});

function _getFiveMinuteService() {
	var me = _getFiveMinuteService;
	if (!me.promise) {
		me.promise = Promise.resolve(Utils.getServer().getFiveMinuteInterface());
	}
	return me.promise;
}

function _preflight(data) {
	_getFiveMinuteService().then(function(service) {
		return service.preflight(data);
	});
}

Store.appDispatch = AppDispatcher.register(function(data) {
    var action = data.action;

    switch(action.type) {
		case Constants.actions.PREFLIGHT:
			_preflight(data);
			break;

        default:
            return true;
    }
    return true;
});


module.exports = Store;
