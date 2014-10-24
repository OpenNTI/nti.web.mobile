'use strict';
/** @module library/Actions */
var merge = require('react/lib/merge');

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Api = require('./Api');
var Constants = require('./Constants');

var loadPromise;

/**
 * Actions available to views for library-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {

	load: function() {
		if (!loadPromise) {
			console.log('Library Action: Load called');
		    loadPromise = Api.getLibrary(true).then(function(library) {
				dispatch(Constants.LOADED_LIBRARY, library);
			});
		}
		return loadPromise;
    },


	reload: function() {
		loadPromise = null;
		return this.load();
	}

});


function dispatch(key, collection) {
	AppDispatcher.handleRequestAction({
		actionType: key,
		response: collection
	});
}
