import React from 'react';
import * as RectUtils from 'common/utils/rects';

import {NOT_FOUND, HIDDEN} from './Annotation';
import Highlight from './Highlight';

export default class Note extends Highlight {

	static handles (item) {
		return /note$/i.test(item.MimeType);
	}


	constructor (...args) {
		super(...args);
		this.isNote = true;
	}


	resolveVerticalLocation () {
		let rect = RectUtils.safeBoundingBoxForRange(this.getRange());
		if (!rect) {
			return NOT_FOUND;
		}

		let reader = React.findDOMNode(this.reader);

		reader = reader ? reader.getBoundingClientRect().top : 0;

		return !RectUtils.isZeroRect(rect) ? (rect.top - reader) : HIDDEN;
	}
}
