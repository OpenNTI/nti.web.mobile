import {Mixins} from 'nti-web-commons';

import CollectionAccessor from './AssignmentCollectionAccessor';

export default {
	mixins: [CollectionAccessor, Mixins.ItemChanges],


	//Ignore this... its for the ItemChanges mixin.
	getItem () {
		return this.getAssignments().getGroupedStore();
	},

	//This is the public accessor
	getStore () {
		return this.getItem();
	}
};
