'use strict';
/** @module catalog/Actions */
var merge = require('react/lib/merge');

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Api = require('./Api');
var Constants = require('./Constants');

/**
 * Actions available to views for catalog-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {

	reload: function() {
		this.loadCatalog(true);
	},

	loadCatalog: function(reload) {
        Api.getCatalog(!!reload)
			.then(function(catalog) {
				dispatch(Constants.LOADED_CATALOG, catalog);
			})
			.catch(function(e){
	        	console.log('loadCatalog failed. %O', e);
	        });
    },
});


function dispatch(key, collection) {
	AppDispatcher.handleRequestAction({
		type: key,
		response: collection
	});
}
