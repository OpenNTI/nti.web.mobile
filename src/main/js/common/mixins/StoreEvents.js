
const getHandlers = Symbol('HandlersGetter');
const getStore = Symbol('StoreGetter');
const onStoreChange = Symbol('StoreChangedEventHandlerMapper');

export default {

	componentWillMount() {
		this[getStore] = getStoreImpl;
		this[getHandlers] = getHandlersImpl;
		this[onStoreChange] = onStoreChangeImpl;
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


function getStoreImpl() {
	return this.BackingStore || console.warn('BackingStore property not set.', this);
}


function getHandlersImpl() {
	return this.HandleStoreEvents || console.warn('HandleStoreEvents property not set.', this);
}


function onStoreChangeImpl(event) {
	if (!event || !event.type || typeof event.type !== 'string') {
		console.error('Bad Event: %o', event);
		return;
	}
	let componentName = this.type.name;
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
