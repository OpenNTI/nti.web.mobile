'use strict';

var EventEmitter = require('events').EventEmitter;
var merge = require('merge');

var CHANGE_EVENT = 'visibilitychange';
var views = 0;
var prefix = (function () {

	try {
		var prefixes = ['webkit','moz','ms','o'];
	    var p = null, i = 0;
	    if (document.hidden !== undefined) {
			p = '';
		}
		else {
			// Test all vendor prefixes
			for(; i < prefixes.length; i++) {
				if (document[prefixes[i] + 'Hidden'] !== undefined) {
					p = prefixes[i];
					break;
				}
			}
		}

		return p;
	} catch(e) {
		return null;
	}

})();
var eventName = prefix + 'visibilitychange';
var propertyName = prefix === '' ? 'hidden' : (prefix + 'Hidden');

function VisibilityMonitor(){}

merge(VisibilityMonitor.prototype, EventEmitter.prototype, {
	getViews: function() {return views;},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
});

var mon = new VisibilityMonitor();

function countView() {
	var hidden = document[propertyName];

	// The page is in foreground and visible
	if (hidden === false) {
		views++;
	}
	console.debug('Emitting: Visibility Change: hidden? ', hidden);
	mon.emit(CHANGE_EVENT, !hidden);
}

function setupPageVisibility() {
	if (prefix !== null) {
		document.addEventListener(eventName, countView);
		countView();
    }
}

setupPageVisibility();
module.exports = mon;
