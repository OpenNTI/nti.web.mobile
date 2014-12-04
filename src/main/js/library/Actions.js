'use strict';
/** @module library/Actions */

var AppDispatcher = require('dispatcher/AppDispatcher');

var Api = require('./Api');
var Constants = require('./Constants');

var willLoad;

/**
 * Actions available to views for library-related functionality.
 */
module.exports = {

	load: function(reload) {

		var result = Api.getLibrary(reload);

		if (!willLoad || reload) {
			//This should only fire for actual loads and not cached (previously-resolved) promises.
			result = willLoad = result
				.then(function(library) {
					dispatch(Constants.LOADED_LIBRARY, library);
				});
		}

		return result;
    },


	reload: function() {
		return this.load(true);
	}

};


function dispatch(key, collection) {
	AppDispatcher.handleRequestAction({
		type: key,
		response: collection
	});
}
