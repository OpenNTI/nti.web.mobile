const removeKey = Symbol('removeKey');

export default class OrderedMap {

	constructor () {
		Object.assign(this, {
			keys: [],
			records: {}
		});
	}

	set (key, val) {
		let idx = this.keys.indexOf(key);
		if (idx > -1) {
			// remove existing key
			this.keys.splice(idx, 1);
		}
		this.keys.push(key);
		this.records[key] = val;
	}

	get (key) {
		return this.records[key];
	}

	remove (key) {
		this[removeKey](key);
		delete this.records[key];
	}

	values () {
		return this.keys.map(k => this.records[k]);
	}

	[removeKey] (key) {
		let {keys} = this;
		let idx = keys.indexOf(key);
		return (idx > -1) ?
			keys.splice(idx, 1) :
			null;
	}

	last () {
		let {keys, records} = this;
		return records[keys[keys.length - 1]];
	}
}
