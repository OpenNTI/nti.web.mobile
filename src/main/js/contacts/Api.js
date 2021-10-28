import { getService, getAppUser } from '@nti/web-client';
import { decodeFromURI } from '@nti/lib-ntiids';

import { USERS, GROUPS, LISTS } from './Constants';

const storeGetters = {
	[USERS]: async () => (await getService()).getContacts(),
	[GROUPS]: async () => (await getService()).getGroups(),
	[LISTS]: async () => (await getService()).getContacts(),
};

export async function getStore(type) {
	return (await storeGetters[type]()).waitForPending();
}

export async function getSuggestedContacts() {
	return (await getAppUser()).fetchLink('SuggestedContacts');
}

export async function getDistributionList(id) {
	const listId = decodeFromURI(id);
	const store = await getStore(LISTS);
	const lists = store.getLists();
	return lists.find(list => decodeFromURI(list.getID()) === listId) || null;
}
