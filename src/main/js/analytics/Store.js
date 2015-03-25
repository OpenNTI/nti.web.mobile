'use strict';

import TypedEventEmitter from 'common/TypedEventEmitter';
import * as Constants from './Constants';
import {CHANGE_EVENT} from 'common/constants/Events';
import AppDispatcher from 'dispatcher/AppDispatcher';
import {getService}from 'common/utils';
import {FixedQueue as fixedQueue} from 'fixedqueue';
import {startIdleTimer} from './IdleTimer';

let queue = [];
let postFrequency = 10000;
let timeoutId;

let _contextHistory = fixedQueue(11);

// var Store = autobind(Object.assign({}, EventEmitter.prototype, {
class AnalyticsStore extends TypedEventEmitter {

	init() {
		startTimer();
		startIdleTimer(endSession, resumeSession);
	}

	pushHistory(item) {
		if (_contextHistory[_contextHistory.length - 1] !== item ) { // omit duplicate entries
			_contextHistory.enqueue(item);
		}
	}

	getHistory() {
		return _contextHistory.slice(0);
	}

	enqueueEvent(analyticsEvent) {
		queue.push(analyticsEvent);
	}

	_haltActiveEvents() {
		return new Promise(resolve => {
			queue.forEach(event => {
				if (!event.finished) {
					event.halt();	
				}
			});
			resolve();
		});
	}

	_processQueue() {
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
			.then(function(service) {
				return service.postAnalytics(items.map(item => item.getData()));
			})
			.then(function(response) {
				console.log('%i of %i analytics events accepted.', response, items.length);
				return response;
			})
			.catch(function(r) {
				console.warn(r);
				// put items back in the queue
				queue.push.apply(queue, items);
			});

	}

}

let Store = new AnalyticsStore();

// for submitting analytics events/flushing the queue.
function startTimer() {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(
		function() {
			// process the queue and start the timer again.
			Store._processQueue().then(startTimer);
		},
		postFrequency
	);
}

function endSession() {
	console.debug('Ending analytics session.');
	clearTimeout(timeoutId);
	let haltEvents = Store._haltActiveEvents();
	let shutdown = haltEvents.then(
		Store._processQueue().then(() => {
			return getService().then(service => {
				return service.endAnalyticsSession();
			});
		})
	);
	shutdown.then(startTimer);
}

function resumeSession() {
	console.debug('Resume analytics session.');
	Store.emit(CHANGE_EVENT, {type: Constants.RESUME_SESSION});
}

AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch (action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.

		case Constants.EVENT_STARTED:
			console.log('Analytics Store received event: %s, %O', action.event.MimeType, action);
			Store.enqueueEvent(action.event);
		break;

		case Constants.EVENT_ENDED:
		break;

		case Constants.END_SESSION:
			endSession();
		break;

		case Constants.RESUME_SESSION:
			console.log('dispatching RESUME_SESSION');
			resumeSession();
		break;

		default:
			return true;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default Store;
