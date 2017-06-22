const optOuts = [];

export function ensureTopFrame () {
	if (typeof window !== 'undefined' && window.top !== window) {
		if (optOuts.every(f => f())) {
			window.top.location.href = window.location.href;
			//If the frame busting code is blocked, tell them embedding is not supported.
			window.location.replace('iframe.html');
		}
	}
}

export function registerOptOutTestHandler (fn) {
	if (typeof fn !== 'function') {
		throw new Error('Argument must be a function');
	}
	optOuts.push(fn);
}

export function unregisterOptOutTestHandler (fn) {
	if(optOuts.indexOf(fn) > -1) {
		optOuts.splice(optOuts.indexOf(fn), 1);
	}
}
