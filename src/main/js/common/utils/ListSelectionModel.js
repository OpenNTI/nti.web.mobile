
const Selected = Symbol();

export default class ListSelection {

	constructor (initialSelection = []) {
		this[Selected] = initialSelection.slice();
	}


	isSelected (object) {
		return this[Selected].indexOf(object) >= 0;
	}

	add (...objects) {
		let list = this[Selected];
		//don't use push, treat the array as immutable
		this[Selected] = [...list, ...objects];
	}

	remove (...objects) {
		let list = this[Selected];

		for (let object of objects) {
			let i = list.indexOf(object);
			if (i >= 0) {
				//don't use splice... treat the array as immutable.
				list = list.slice(0,i).concat(list.slice(i + 1));
			}
		}

		this[Selected] = list;
	}


	getItems () {
		return this[Selected].slice();
	}
}
