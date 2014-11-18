'use strict';
/** @module library/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');

var Api = require('./Api');
var Constants = require('./Constants');

var loadPromise;

/**
 * Actions available to views for library-related functionality.
 */
module.exports = {

	load: function() {
		if (!loadPromise) {
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

};


function dispatch(key, collection) {
	AppDispatcher.handleRequestAction({
		type: key,
		response: collection
	});
}
