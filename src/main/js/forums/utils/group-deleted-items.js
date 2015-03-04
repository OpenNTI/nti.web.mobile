
import {types} from '../Constants';

const deletedItemGroupType = 'application/vnd.nextthought.' + types.DELETED_ITEM_GROUP;

export default function (items) {

	function getOrCreateDeletedItemGroup(itemsArr) {
		// if the last item in the array is already a deleted items group, use it.
		if (itemsArr.length > 0 && (itemsArr[itemsArr.length - 1]).MimeType === deletedItemGroupType) {
			return itemsArr[itemsArr.length - 1];
		}
		let group = {
			MimeType: deletedItemGroupType,
			items: []
		};
		itemsArr.push(group);
		return group;
	}

	return (items || []).reduce((previous, current) => {
		if (current.Deleted) {
			// push the current item into a deleted item group, creating the group if necessary
			let deletedItemGroup = getOrCreateDeletedItemGroup(previous);
			deletedItemGroup.items.push(current);
		}
		else {
			previous.push(current);	
		}
		return previous;
	}, []);
}

