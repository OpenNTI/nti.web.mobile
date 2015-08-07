import {getService} from 'common/utils';
import {USERS, GROUPS, LISTS} from './Constants';

const storeGetters = {
	[USERS]: getContactsStore,
	[GROUPS]: getGroupsStore,
	[LISTS]: getListsStore
};

function getContactsStore () {
	return getService()
		.then(service => service.getContacts());
}

function getGroupsStore () {
	return getService()
		.then(service => service.getGroups());
}

function getListsStore () {
	return getService()
		.then(service => service.getLists());
}

export default {
	getStore (type) {
		return storeGetters[type]();
	}
};
