'use strict';
/** @module navigation/Actions */

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var Environment = require('react-router-component').environment;
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge')
var Store = require('./Store');

var Constants = require('./Constants');

/**
 * Actions available to views for navigation-related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	navigate: function(href, replace) {
		console.log('navigation.Actions::navigate', href, !!replace);
		Environment.defaultEnvironment.navigate(href, {replace:replace});
	},


	publishNav: function(key,navRecord) {
		console.log('navigation.Actions::publishNav. key: %s, record: %O', key, navRecord);
		Store.publishNav(key,navRecord);
	},

	openDrawer: function() {
		//I don't think this is the best way to accomplish this... ick.
		$('#left-menu').click();
	}

});
