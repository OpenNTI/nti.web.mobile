const ACTIVE = 'active';
const IDLE = 'idle';

const DEFAULTS = {
	//start as soon as timer is set up
	start: true,
	// timer is enabled
	enabled: true,
	// amount of time before timer fires
	timeout: 30000,
	// what element to attach to
	element: null,
	// activity is one of these events
	events: 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove'
};


const Schedule = Symbol('state:schedule');
const ToggleState = Symbol('state:toggle');

export default class Idle {

	constructor (opt) {
		let op = this.opt = Object.assign({}, DEFAULTS, opt);
		this.element = op.element || document;

		this.state = {
			idle: op.idle,
			timeout: op.timeout,
			enabled: op.enabled,
			idleFn: [],
			activeFn: []
		};

		if (op.start) {
			this.start();
		}
	}


	/**
	 * Start the idle timer.
	 */
	start () {
		let {state, element, opt} = this;

		let handler = () => {
			clearTimeout(state.timerId);

			if (!state.enabled) {
				return;
			}

			if (state.idle) {
				this[ToggleState](state);
			}

			state.timerId = this[Schedule]();
		};

		state.handler = handler;

		let events = opt.events.split(' ');
		for (let evt of events) {
			on(element, evt, handler);
		}

		state.timerId = this[Schedule]();
	}


	/**
	 * Stop the idle timer.
	 */
	stop () {
		let {state, element, opt} = this;

		state.enabled = false;

		//clear any pending timeouts
		clearTimeout(state.timerId);

		let events = opt.events.split(' ');
		for (let evt of events) {
			un(element, evt, state.handler);
		}
	}


	on (state, fn) {
		let {idleFn, activeFn} = this.state;
		let list = (state === IDLE) ? idleFn : activeFn;
		list.push(fn);
	}

	getElapsed () {
		return ( +new Date() ) - this.state.olddate;
	}



	[Schedule] () {
		return setTimeout(()=>this[ToggleState](), this.state.timeout);
	}


	[ToggleState] () {
		let {state} = this;
		state.idle = !state.idle;

		let now = Date.now();
		let elapsed = now - state.olddate;
		state.olddate = now;

		// handle js alert or comfirm popup
		if (state.idle && (elapsed < state.timeout)) {
			state.idle = false;
			clearTimeout(state.timerId);
			if (state.enabled) {
				state.timerId = this[Schedule]();
			}
			return;
		}


		let evt = state.idle ? IDLE : ACTIVE;
		let fns = (evt === IDLE) ? state.idleFn : state.activeFn;
		for (let fn of fns) {
			fn();
		}
	}
}



function on (element, event, fn) {
	try {
		element.addEventListener(event, fn, false);
	}
	catch (e) {
		if (element.attachEvent) {
			element.attachEvent('on' + event, fn);
		}
	}
}

function un (element, event, fn) {
	try {
		element.removeEventListener(event, fn, false);
	}
	catch (e) {
		if (element.detachEvent) {
			element.detachEvent('on' + event, fn);
		}
	}
}
