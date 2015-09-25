import StorePrototype from 'common/StorePrototype';
import {SEARCH_CHANGE, SORT_CHANGE} from './Constants';

const search = Symbol('search');
const sort = Symbol('sort');
const assignmentsList = Symbol('assignmentsList');


class SearchSortStore extends StorePrototype {

	set search (value) {
		this[search] = value;
		this.emitChange({type: SEARCH_CHANGE});
	}

	set sort (value) {
		this[sort] = value;
		this.emitChange({type: SORT_CHANGE});
	}

	set assignmentsList (list) {
		this[assignmentsList] = list;
		this.emitChange();
	}

	get assignmentsList () {
		return this[assignmentsList];
	}

	get search () {
		return this[search];
	}

	get sort () {
		return this[sort];
	}

}

export default new SearchSortStore();
