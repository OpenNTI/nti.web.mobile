'use strict';

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var filterBins = require('./utils/filter-forum-bins');
var Constants = require('./Constants');

var CHANGE_EVENT = require('common/constants').CHANGE_EVENT;

var _data = {};
var _filtered = {};
var _loaded = false;

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'course.Store',

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

	setData(data) {
		persistData(data);
		this.emitChange({
			type: Constants.DATA_CHANGE
		});
	},

	hasData() {
		return _loaded;
	},

	getData() {
		return _filtered;
	}
});

function persistData(data) {
	if (data && data instanceof Error) {
		_data = {error: data, notFound: data.message === Constants.NOT_FOUND};
		_loaded = false;
		return;
	}
	_filtered = filterBins(data);
	_data = data;
	_loaded = true;
}

Store.appDispatch = AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.type) {
		default:
			return true;
	}
	return true;
});

module.exports = Store;
