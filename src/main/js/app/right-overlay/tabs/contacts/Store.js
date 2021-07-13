import { Stores } from '@nti/lib-store';
import { getService } from '@nti/web-client';

export const LOADING = 'loading';
export const CONTACTS = 'contacts';

export default class Store extends Stores.SimpleStore {
	constructor() {
		super();
		this.set(LOADING, true);
	}

	freeStore() {
		this.contactsStore?.off?.('change', this.onContactsChange);
		super.freeStore();
	}

	// service.getContacts() returns a store that won't have loaded its data yet
	// when we initially get a reference to it; so we need to listen for its
	// change events.
	onContactsChange = contacts =>
		this.set({
			[CONTACTS]: Array.from(contacts),
		});

	async load() {
		this.set(LOADING, true);
		const store = (this.contactsStore = (await getService()).getContacts());
		store?.on?.('change', this.onContactsChange);
		this.set({
			[CONTACTS]: Array.from(store),
			[LOADING]: false,
		});
	}
}
