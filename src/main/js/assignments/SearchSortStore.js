import StorePrototype from 'common/StorePrototype';

const search = Symbol('search');
const sort = Symbol('sort');
const history = Symbol('history');
const assignmentsList = Symbol('assignmentsList');


class SearchSortStore extends StorePrototype {

	set search (value) {
		this[search] = value;
		this.emitChange({type: 'SEARCH_CHANGE'});
	}

	set sort (value) {
		this[sort] = value;
		this.emitChange({type: 'SORT_CHANGE'});
	}

	set assignmentsList (list) {
		this[assignmentsList] = list;
		this.emitChange({type: 'LIST_CHANGE'});
	}

	set history (value) {
		this[history] = value;
		this.emitChange({type: 'LIST_CHANGE'});
	}

	get history () {
		return this[history];
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

	clear () {
		delete this[search];
		delete this[sort];
	}

}

export default new SearchSortStore();
