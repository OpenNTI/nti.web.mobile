import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';

export const LOADING = 'loading';
export const CONTACTS = 'contacts';

export default class Store extends Stores.SimpleStore {
	constructor () {
		super();
		this.set(LOADING, true);
	}

	async load () {
		this.set(LOADING, true);
		const contacts = await (await getService()).getContacts();
		this.set({
			[CONTACTS]: Array.from(contacts),
			[LOADING]: false
		});
	}
}
