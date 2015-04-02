import Idle from 'common/utils/idle';
import {analyticsConfig} from 'common/utils';
import AppDispatcher from 'dispatcher/AppDispatcher';
import {EVENT_STARTED, EVENT_ENDED} from './Constants';
import {WATCH_VIDEO} from 'nti.lib.interfaces/models/analytics/MimeTypes';

let timer;
let analytics = analyticsConfig();
let idleTimeMs = (analytics.idleTimeoutSeconds || 60) * 1000;

let suspensionEventTypes = new Set([WATCH_VIDEO]);

// events considered activity, non-idle
let idleEvents = analytics.idleEvents || 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove';

// end/resume analytics sesssion when user is idle/becomes active.
export function startIdleTimer(idleFn, activeFn) {
	// console.debug('startIdleTimer');
	timer = new Idle({
		timeout: idleTimeMs,
		events: idleEvents
	});
	timer.on('idle', idleFn);
	timer.on('active', activeFn);
}

let handlers = {
	[EVENT_STARTED](action) {
		if (suspensionEventTypes.has((action.event||{}).MimeType)) {
			timer.stop();
		}
	},
	[EVENT_ENDED](action) {
		if (suspensionEventTypes.has((action.event||{}).MimeType)) {
			timer.start();
		}
	}
};

AppDispatcher.register(function(payload) {
	let action = payload.action;
	if (handlers[action.type]) {
		handlers[action.type](action);
	}
});
