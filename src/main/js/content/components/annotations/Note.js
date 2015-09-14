import ReactDOM from 'react-dom';
import {safeBoundingBoxForRange, isZeroRect} from 'common/utils/rects';
import iOSversion from 'common/utils/ios-version';

import {NOT_FOUND, HIDDEN, RETRY_AFTER_DOM_SETTLES} from './Annotation';
import Highlight from './Highlight';

function isBoundingClientRectBroken () {
	let ios = iOSversion();
	return ios && ios[0] < 8;
}

export default class Note extends Highlight {

	static handles (item) {
		return /note$/i.test(item.MimeType);
	}

	static createFrom (data) {

		let base = {
			MimeType: 'application/vnd.nextthought.note',
			style: 'suppressed',
			title: null,
			body: null,
			sharedWith: []
		};

		return Object.assign(base, data);
	}

	constructor (...args) {
		super(...args);
		this.isNote = true;
	}


	shouldRender () {
		if (this.getRecordField('style') !== 'suppressed') {
			return super.shouldRender();
		}
	}


	resolveVerticalLocation () {
		let range = this.getRange();
		let rect = safeBoundingBoxForRange(range);
		if (!rect) {
			if (this.hadValidRange()) {
				return RETRY_AFTER_DOM_SETTLES;
			}

			console.log('Not Found:', this.getRecord().toJSON(), range);
			return NOT_FOUND;
		}

		let has = !isZeroRect(rect);

		if (!has) {
			let e = range.startContainer;
			rect = e && e.getBoundingClientRect();
			has = !isZeroRect(rect);
		}

		let top = (has && rect.top) || HIDDEN;

		if (has) {
			let reader = ReactDOM.findDOMNode(this.reader);
			top -= reader ? reader.getBoundingClientRect().top : 0;
		}
		else {
			console.log('Hidden:', range, rect);
		}

		if (isBoundingClientRectBroken()) {
			top - document.body.scrollTop;
		}
		return top;
	}
}
