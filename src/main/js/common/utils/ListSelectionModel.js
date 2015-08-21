import {EventEmitter} from 'events';

const Selected = Symbol();

export default class ListSelection extends EventEmitter {

	constructor (initialSelection = []) {
		super();
		this[Selected] = initialSelection.slice();
	}


	isSelected (object) {
		return this[Selected].findIndex(o => o.getID() === object.getID()) >= 0;
	}

	add (...objects) {
		let list = this[Selected];
		for (let obj of objects) {
			if (this.isSelected(obj)) { continue; }
			//don't use push, treat the array as immutable
			list = [...list, obj];
		}

		if (this[Selected] !== list) {
			this[Selected] = list;
			this.emit('change');
			return true;
		}
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

		if (this[Selected] !== list) {
			this[Selected] = list;
			this.emit('change');
			return true;
		}
	}


	getItems () {
		return this[Selected].slice();
	}
}
