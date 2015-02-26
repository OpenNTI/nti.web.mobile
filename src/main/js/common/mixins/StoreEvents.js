
const getHandlers = Symbol('HandlersGetter');
const getStore = Symbol('StoreGetter');
const onStoreChange = Symbol('StoreChangedEventHandlerMapper');

const handlerMapKey = 'backingStoreEventHandlers';

export default {

	mixinAdditionalHandler (eventId, handlerId) {
		if (!this.hasOwnProperty(handlerMapKey)) {
			this[handlerMapKey] = Object.create(this[getHandlers]()||{});
		}

		let map = this[getHandlers]();

		if (eventId in map) {
			var handlers = makeSet(map[eventId]);
			handlers.add(handlerId);
			map[eventId] = handlers;
		}
		else {
			map[eventId] = handlerId;	
		}
	},

	componentWillMount() {
		this[getStore] = getKey.bind(this, 'backingStore');
		this[getHandlers] = getKey.bind(this, handlerMapKey);
		this[onStoreChange] = onStoreChangeImpl.bind(this);
	},

	componentDidMount () {
		let store = this[getStore]();
		if (store) {
			store.addChangeListener(this[onStoreChange]);
		}
	},

	componentWillUnmount () {
		let store = this[getStore]();
		if (store) {
			store.removeChangeListener(this[onStoreChange]);
		}
	}
};

/**
* Returns a new Set containing item if item is not null and not already a Set
*/
function makeSet(item) {
	return (!item || item instanceof Set) ? item : new Set([item]);
}

function getName() {
	try {
		return this._currentElement.type.displayName;
	} catch (e) {
		return this;
	}
}


function getKey(key) {
	let componentName = getName.call(this);
	return this[key] || console.warn('%s property not set in: %s', key, componentName);
}


function onStoreChangeImpl(event) {
	if (typeof event === 'string') {
		console.error('Wrapping deprecated string event into object: %s', event);
		event = {type: event};
	}

	if (!event || event.type == null) {
		console.error('Bad Event: %o', event);
		return;
	}
	let componentName = getName.call(this);
	let handlers = this[getHandlers]() || {};
	let handlerSet = makeSet(handlers[event.type] || handlers.default);
	if (!handlerSet) {
		console.debug('Event %s does not have a handler in component: %s', event.type, componentName);
		return;
	}
	for (let handler of handlerSet) {
		if (typeof handler !== 'function') {
			if (!this[handler]) {
				console.debug('Event Handler %s does not exist in component: %s', handler, componentName);
				return;
			}
			handler = this[handler];
		}
		handler.call(this, event);
	}
}
