'use strict';
/** @module navigation/Actions */

var Url = require('url');

var Environment = require('react-router-component').environment.defaultEnvironment;
var EventEmitter = require('events').EventEmitter;

var Store = require('./Store');


/**
 * Actions available to views for navigation-related functionality.
 **/
module.exports = Object.assign(EventEmitter.prototype, {

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


	unpublishNav: function(key) {
		Store.unpublishNav(key);
	},

	publishNav: function(key,navRecord) {
		console.log('navigation.Actions::publishNav. key: %s, record: %O', key, navRecord);
		Store.publishNav(key,navRecord);
	},

	setLoading: function(isLoading) {
		Store.setLoading(isLoading);
	}

});
