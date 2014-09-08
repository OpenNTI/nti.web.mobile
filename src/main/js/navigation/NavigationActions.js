/** @module login/LoginActions */

var AppDispatcher = require('../common/dispatcher/AppDispatcher');
var NavigationConstants = require('./NavigationConstants');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge')

var Router = require('react-router-component');
var Environment = Router.environment;

/**
 * Actions available to views for login-related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	/** Initializes the login system. */
	navigate: function(href) {
		console.log('NavigationActions::navigate');
		Environment.defaultEnvironment.navigate(href, {replace:true});
	}

});

