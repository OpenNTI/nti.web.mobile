import {isTextNode} from 'nti.lib.dom';
import {getWidth as getViewportWidth, getHeight as getViewportHeight} from './viewport';

export function getElementRect (el) {
	let rect, w, h;
	if (el && el.getBoundingClientRect) {
		rect = el.getBoundingClientRect();
	}

	if (!rect && el) {
		if (el.nodeType !== 1/*Node.ELEMENT_NODE*/) {
			//
			h = getViewportHeight();
			w = getViewportWidth();
			rect = {
				top: 0, left: 0,
				right: w, bottom: h,
				width: w, height: h
			};
		}
		// else {
		// 	rect = {
		// 		top: el.offsetTop,
		// 		left: el.offsetLeft,
		// 		bottom: el.offsetTop + el.offsetHeight,
		// 		right: el.offsetLeft + el.offsetWidth,
		// 		width: el.offsetWidth,
		// 		height: el.offsetHeight
		// 	};
		// }
	}

	return rect;
}

export const isZeroRect = r => !r || ((r.top + r.left + r.height + r.width) === 0);

/**
 * Gets the bounding rect of the provided range.  If the rect is zero
 * but the range is not collapsed we will attempt to get the bounding box
 * based on the ranges contents.  We do this because IE sucks.
 * @param {Range} range range
 * @returns {Rect} Bounding Rect
 */
export function safeBoundingBoxForRange (range) {
	let {collapsed, commonAncestorContainer, startContainer, startOffset, endContainer, endOffset} = range || {};
	let rect = range ? range.getBoundingClientRect(range) : null;

	try {
		if (rect && !collapsed && isZeroRect(rect) && range.toString() === '' && !isTextNode(startContainer)) {
			console.log('No rect information...attempting to get selected node rect instead');
			let node = startContainer.childNodes[startOffset];
			rect = node.getBoundingClientRect();
		}
		else if (rect && !collapsed && isZeroRect(rect)) {
			if (startContainer === endContainer && startContainer.nodeType !== Node.TEXT_NODE) {
				if (startOffset + 1 === endOffset) {
					console.debug('No rect information... the range contains just one node, use that instead.');
					rect = startContainer.childNodes[startOffset].getBoundingClientRect();
				}
				else if (startOffset === 0 && endOffset === endContainer.childNodes.length) {
					console.debug('No rect information... the range contains all all contents of the object/doc, use the startContainer.');
					rect = startContainer.getBoundingClientRect();
				}
			}
		}

		//if it is still the zero rect and the common ancestor is an object, use the ancestors bounding rect
		if (isZeroRect(rect) && commonAncestorContainer && commonAncestorContainer.tagName === 'OBJECT') {
			rect = commonAncestorContainer.getBoundingClientRect();
		}
	}
	catch (er) {
		console.warn(er.stack || er.message || er);
	}

	return rect;
}
