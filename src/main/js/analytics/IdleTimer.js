import Idle from 'common/utils/idle';

import AppDispatcher from 'nti-lib-dispatcher';
import {EVENT_STARTED, EVENT_ENDED} from './Constants';
import {WATCH_VIDEO} from 'nti-lib-interfaces/lib/models/analytics/MimeTypes';

let timer;
let idleTimeMs;

let suspensionEventTypes = new Set([WATCH_VIDEO]);

// end/resume analytics sesssion when user is idle/becomes active.
export function startIdleTimer (idleFn, activeFn) {
	if (idleTimeMs == null) {
		idleTimeMs = 1800000;//default to 30min
	}

	// console.debug('startIdleTimer');
	timer = new Idle({ timeout: idleTimeMs });
	timer.on('idle', idleFn);
	timer.on('active', activeFn);
}

let handlers = {
	[EVENT_STARTED] (action) {
		if (suspensionEventTypes.has((action.event || {}).MimeType)) {
			timer.stop();
		}
	},
	[EVENT_ENDED] (action) {
		if (suspensionEventTypes.has((action.event || {}).MimeType)) {
			timer.start();
		}
	}
};

AppDispatcher.register(payload => {
	let action = payload.action;
	if (handlers[action.type]) {
		handlers[action.type](action);
	}
});
