'use strict';

var keyMirror = require('react/lib/keyMirror');

var handlers = [
	'onPlaying',
	'onPause',
	'onEnded',
	'onSeeked',
	'onTimeUpdate'
];

function _eventNameFor(handlerName) {
	// extract event name from handler name (e.g. 'timeupdate' from 'onTimeUpdate')
	return handlerName.toLowerCase().slice(2);
}

var events = {};
handlers.forEach(function(handler) {
	var eventname = _eventNameFor(handler);
	events[eventname] = handler;
});

module.exports = events;
