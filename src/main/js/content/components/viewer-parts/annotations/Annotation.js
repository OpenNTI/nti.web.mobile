
const RECORD = Symbol('record');

export default class Annotation {
	static handles (/*item*/) {
		return false;
	}


	constructor (record, reader) {
		Object.assign(this, {
			[RECORD]: record,
			reader
		});
	}


	get id () {
		return this[RECORD].getID();
	}


	get isModifiable () {
		return this[RECORD].isModifiable;
	}


	getRecordField(field) {
		return this[RECORD][field];
	}
}
