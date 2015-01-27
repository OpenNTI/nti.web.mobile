
const getHandlers = Symbol('HandlersGetter');
const getStore = Symbol('StoreGetter');
const onStoreChange = Symbol('StoreChangedEventHandlerMapper');

export default {

	componentWillMount() {
		this[getStore] = getKey.bind(this, 'backingStore');
		this[getHandlers] = getKey.bind(this, 'backingStoreEventHandlers');
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

	if (!event || !event.type || typeof event.type !== 'string') {
		console.error('Bad Event: %o', event);
		return;
	}
	let componentName = getName.call(this);
	let handlers = this[getHandlers]() || {};
	let handler = handlers[event.type] || handlers.default;
	if (!handler) {
		console.debug('Event %s does not have a handler in component: %s', event.type, componentName);
		return;
	}

	if (typeof handler === 'string') {
		if (!this[handler]) {
			console.debug('Event Handler %s does not exist in component: %s', handler, componentName);
			return;
		}
		handler = this[handler];
	}

	handler.call(this, event);
}
