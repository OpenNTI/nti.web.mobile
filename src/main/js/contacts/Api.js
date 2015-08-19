import {getService} from 'common/utils';
import {USERS, GROUPS, LISTS} from './Constants';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import {getAppUser} from 'common/utils';

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
	},

	getSuggestedContacts () {
		return getAppUser()
			.then(user => user.fetchLinkParsed('SuggestedContacts'));
	},

	getDistributionList (id) {
		let listId = decodeFromURI(id);
		return getListsStore()
			.then(store => {
				let lists = store.getLists();
				return lists.find(list => decodeFromURI(list.getID()) === listId) || null;
			});
	}
};
