'use strict';


function getDocument() {
	return typeof document === 'undefined' ? {} :
		document.documentElement || {};
}

module.exports = {
	getHeight: function() {
		return global.innerHeight || getDocument().clientHeight;
	},

	getWidth: function () {
		return global.innerWidth || getDocument().clientWidth;
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
