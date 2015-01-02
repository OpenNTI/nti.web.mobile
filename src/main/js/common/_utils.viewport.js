'use strict';

module.exports = {
	getHeight: function() {
		var el = document.documentElement || {};
		return window.innerHeight || el.clientHeight;
	},

	getWidth: function () {
		var el = document.documentElement || {};
		return window.innerWidth || el.clientWidth;
	},

	getScreenWidth: function() {
		var fallback = this.getWidth();
		return (global.screen || {}).width || fallback;
	},

	getScreenHeight: function() {
		var fallback = this.getHeight();
		return (global.screen || {}).height || fallback;
	}
};
