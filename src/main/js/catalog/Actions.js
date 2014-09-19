'use strict';
/** @module catalog/Actions */
var merge = require('react/lib/merge')

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

var Api = require('./Api');
var Constants = require('./Constants');

/**
 * Actions available to views for catalog-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {

	loadCatalog: function() {
		console.log('Catalog Action: Load called');
        Api.getCatalog().catch(function(e){
        	console.log('loadCatalog failed. %O', e);
        	debugger;
        });
    },
});
