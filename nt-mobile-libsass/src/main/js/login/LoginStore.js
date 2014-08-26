var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _links = {};
var _loggedIn = false;

var LoginStore = merge(EventEmitter.prototype, {

	isLoggedIn: function() {
		return _loggedIn;
	},
	emitChange: function() {
		this.emit(CHANGE_EVENT);
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
