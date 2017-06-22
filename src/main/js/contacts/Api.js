import {getService, getAppUser} from 'nti-web-client';
import {decodeFromURI} from 'nti-lib-ntiids';

import {USERS, GROUPS, LISTS} from './Constants';

const storeGetters = {
	[USERS]: ()=> getService().then(service => service.getContacts()),
	[GROUPS]: ()=> getService().then(service => service.getGroups()),
	[LISTS]: ()=> getService().then(service => service.getLists())
};


export function getStore (type) {
	return storeGetters[type]();
}

export function getSuggestedContacts () {
	return getAppUser()
		.then(user => user.fetchLinkParsed('SuggestedContacts'));
}

export function getDistributionList (id) {
	const listId = decodeFromURI(id);
	return getStore(LISTS).then(store =>
		store.getLists().find(list => decodeFromURI(list.getID()) === listId) || null);
}
