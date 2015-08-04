import {FixedQueue as fixedQueue} from 'fixedqueue';

import AppDispatcher from 'dispatcher/AppDispatcher';

import TypedEventEmitter from 'common/TypedEventEmitter';
import {CHANGE_EVENT} from 'common/constants/Events';
import {getService}from 'common/utils';

import ensureArray from 'nti.lib.interfaces/utils/ensure-array';
import {getModel} from 'nti.lib.interfaces';

import {startIdleTimer} from './IdleTimer';
import * as Constants from './Constants';

let localStorageKey = 'analytics_queue';

let queue = [];
let postFrequency = 10000;
let timeoutId;

let contextHistory = fixedQueue(11);

const ProcessLocalStorage = Symbol('ProcessLocalStorage');
const HaltActiveEvents = Symbol('HaltActiveEvents');
const ProcessQueue = Symbol('ProcessQueue');
const FlushLocalStorage = Symbol('FlushLocalStorage');

class AnalyticsStore extends TypedEventEmitter {

	init () {
		startTimer();
		startIdleTimer(this.endSession.bind(this, 'idle timer'), this.resumeSession.bind(this, 'idle/activity'));
		this[ProcessLocalStorage]();
	}

	pushHistory (item) {
		if (contextHistory[contextHistory.length - 1] !== item ) { // omit duplicate entries
			contextHistory.enqueue(item);
		}
	}

	getHistory () {
		return contextHistory.slice(0);
	}

	enqueueEvents (analyticsEvent) {
		let events = ensureArray(analyticsEvent);
		events.forEach(e => queue.push(e));
		try {
			window.localStorage.setItem(localStorageKey, JSON.stringify(queue));
		}
		catch (e) {
			// no local storage? that's fine.
			console.warn('localStorage.setItem failed. (No local storage?)', e);
		}
	}

	[HaltActiveEvents] (events=queue) {
		if (!events) {
			return Promise.resolve([]);
		}
		return new Promise(resolve => {
			let halted = events.reduce((result, event) => {
				if (!event.MimeType) {
					console.error('Analytics event with no MimeType in localStorage? %o', event);
					return result;
				}
				if (!event.finished) {
					let model = getModel(event.MimeType);
					if (model && model.halt) {
						model.halt(event);
					}
					result.push(event);
				}
				return result;
			}, []);
			resolve(halted);
		});
	}

	endSession (/*reason='no reason specified'*/) {
		// console.debug('Ending analytics session. (%s)', reason);
		clearTimeout(timeoutId);
		let haltEvents = this[HaltActiveEvents]();
		let shutdown = haltEvents.then(
			this[ProcessQueue]().then(() => {
				return getService().then(service => {
					return service.endAnalyticsSession();
				});
			})
		);
		return shutdown.then(startTimer);
	}

	resumeSession (/*reason='no reason specified'*/) {
		// console.debug('Resume analytics session. (%s)', reason);
		this.emit(CHANGE_EVENT, {type: Constants.RESUME_SESSION});
	}

	[FlushLocalStorage] () {
		window.localStorage.removeItem(localStorageKey);
	}

	[ProcessLocalStorage] () {
		// console.debug('processing local storage');
		try {
			let q = JSON.parse(window.localStorage.getItem(localStorageKey));
			// console.debug('localStorage events: %o', q);
			this[HaltActiveEvents](q).then(events => {
				this.enqueueEvents(events);
				this[ProcessQueue]();
			});
		}
		catch(e) {
			console.debug(e);
		}
	}

	[ProcessQueue] () {
		if (queue.length === 0) {
			return Promise.resolve('No events in the queue.');
		}

		// yank everything out of the queue
		let events = queue;
		queue = [];

		let separated = events.reduce( (previous, current) => {
			(current.finished ? previous.finished : previous.unfinished).push(current);
			return previous;
		}, { finished: [], unfinished: [] } );

		// return unfinished events to the queue
		queue.push(...separated.unfinished);
		let items = separated.finished;

		if (items.length === 0) {
			return Promise.resolve('No finished events in the queue');
		}



		return getService()
			.then(service => service.postAnalytics(items.map(item => item.getData())))
			.then(response => {
				console.log('%i of %i analytics events accepted.', response.EventCount, items.length);
				this[FlushLocalStorage]();
				return response;
			})
			.catch(r => {
				if (r.statusCode === 501) {
					console.log('Dropping analytics: ', r.message);
					this[FlushLocalStorage]();
					return;
				}

				console.warn(r);
				// put items back in the queue
				queue.push.apply(queue, items);
			});

	}

}

let Store = new AnalyticsStore();

// for submitting analytics events/flushing the queue.
function startTimer () {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(
		function () {
			// process the queue and start the timer again.
			Store[ProcessQueue]().then(startTimer);
		},
		postFrequency
	);
}

let eventHandlers = {
	[Constants.EVENT_STARTED]: function(action) {
		console.log('Analytics Store received event: %s, %O', action.event.MimeType, action);
		Store.enqueueEvents(action.event);
	},
	[Constants.RESUME_SESSION]: function(action) {
		console.log('dispatching RESUME_SESSION');
		Store.resumeSession();
	}
};

AppDispatcher.register(payload => {
	let action = payload.action;

	let handler = eventHandlers[action.type];
	if (handler) {
		handler(action);
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default Store;
