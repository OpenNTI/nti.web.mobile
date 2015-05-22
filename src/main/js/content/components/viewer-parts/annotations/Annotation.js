
import * as RectUtils from 'common/utils/rects';

const RECORD = Symbol('record');

export const RENDERED = Symbol('elements');

export const HIDDEN = void 0;
export const NOT_FOUND = -3;
// export const NOT_VISIBLE = -4;

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


	getRange () {
		throw new Error('Not Implemented');
	}


	getRecordField(field) {
		return this[RECORD][field];
	}


	getDocument () {
		let node = this.reader.getContentNode();
		return node && node.ownerDocument;
	}


	createNonAnchorableSpan () {
		let span = this.getDocument().createElement('span');

		span.setAttribute('data-non-anchorable', 'true');

		return span;
	}


	resolveVerticalLocation () {
		let rect = RectUtils.safeBoundingBoxForRange(this.getRange());
		if (!rect) {
			return NOT_FOUND;
		}

		return !RectUtils.isZeroRect(rect) ? rect.top : HIDDEN;
	}

}
