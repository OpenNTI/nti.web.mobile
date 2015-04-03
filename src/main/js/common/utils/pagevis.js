import {EventEmitter} from 'events';

const CHANGE_EVENT = 'visibilitychange';
let views = 0;
let prefix = (()=> {

	try {
		let prefixes = ['webkit', 'moz', 'ms', 'o'];
		let p = null, i = 0;
		if (typeof document === 'undefined') {
			return;
		}

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

const eventName = prefix + 'visibilitychange';
const propertyName = prefix === '' ? 'hidden' : (prefix + 'Hidden');

class VisibilityMonitor extends EventEmitter {

	getViews () { return views; }

	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	}
}

let mon = new VisibilityMonitor();

function countView() {
	let hidden = document[propertyName];

	// The page is in foreground and visible
	if (hidden === false) {
		views++;
	}
	//console.debug('Emitting: Visibility Change: hidden? ', hidden);
	mon.emit(CHANGE_EVENT, !hidden);
}

function setupPageVisibility() {
	if (prefix !== null && typeof document !== 'undefined') {
		document.addEventListener(eventName, countView);
		countView();
	}
}

setupPageVisibility();

export default mon;
