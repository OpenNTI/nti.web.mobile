'use strict';

var Promise = global.Promise || require('es6-promise').Promise;
var React = require('react/addons');

module.exports = {
	injectScript: function(scripturl) {
		return new Promise(function(fullfill,reject) {
			
			var script = document.createElement('script');
			script.src = scripturl;
			document.body.appendChild(script);
			script.onload = function(e) {
				fullfill(e);
			};
			script.onerror = function(e) {
				reject(e);
			}
		});
	}
};
