'use strict';
/** @module navigation/Actions */

var Url = require('url');

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var Environment = require('react-router-component').environment.defaultEnvironment;
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var Store = require('./Store');

var Constants = require('./Constants');

/**
 * Actions available to views for navigation-related functionality.
 **/
module.exports = merge(EventEmitter.prototype, {

	navigate: function(href, replace) {
		console.log('navigation.Actions::navigate', href, !!replace);
		Environment.navigate(href, {replace:replace});
	},


	gotoFragment: function(fragment) {
		var e = Environment;
		var p = e.getPath();
		var u = Url.parse(p);

		u.hash = fragment;

		e.navigate(u.format(), {});
	},


	publishNav: function(key,navRecord) {
		console.log('navigation.Actions::publishNav. key: %s, record: %O', key, navRecord);
		Store.publishNav(key,navRecord);
	}

});
