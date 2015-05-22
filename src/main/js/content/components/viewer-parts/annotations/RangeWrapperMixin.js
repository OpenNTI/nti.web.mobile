import * as DOM from 'nti.lib.dom';
import * as RangeUtils from 'nti.lib.ranges';

const wrap = 'content:RangeWrapperMixin:wrap';

const BEFORE = -1;
const SAME = 0;
const AFTER = 1;


function isInlineElement (node) {
	return {
		none: true,
		inline: true,
		'': true//??
		//Do not include "inline-(block|table)"
	}[getComputedStyle(node).display];
}


function validToWrapEntireNode (node) {
	if (DOM.isTextNode(node)) {
		return true;
	}
	if (DOM.isElement(node)) {
		if (node.childNodes.length === 0) {
			return true;
		}

		if (node.tagName === 'P') {
			return false;
		}

		if (isInlineElement(node)) {
			return true;
		}

		if ((DOM.hasClass(node, 'mathjax') || DOM.hasClass(node, 'mathquill')) &&
			DOM.hasClass(node, 'link-button')) {
			return true;
		}
	}

	return false;
}


export default {


	wrapRange (node, range) {
		let nodeList = [];
		let doc = node.ownerDocument;
		let nodeRange = doc.createRange();


		nodeRange.selectNodeContents(node);

		let startToStart = nodeRange.compareBoundaryPoints(Range.START_TO_START, range);
		let startToEnd = nodeRange.compareBoundaryPoints(Range.START_TO_END, range);

		let endToStart = nodeRange.compareBoundaryPoints(Range.END_TO_START, range);
		let endToEnd = nodeRange.compareBoundaryPoints(Range.END_TO_END, range);

		let valid = validToWrapEntireNode(node);

		//Easy case, the node is completely surronded and valid, wrap the node
		if (valid && (startToStart === AFTER || startToStart === SAME) && (endToEnd === BEFORE || endToEnd === SAME)) {

			let newRange = doc.createRange();

			newRange.selectNode(node);

			nodeList.push(this[wrap](newRange));
		}

		//If the node overlaps with the range in anyway we need to work on it's children
		else {

			for(let i of node.childNodes) {
				nodeList.push(...this.wrapRange(i, range));
			}

			if (node.childNodes.length === 0) {
				let newRange = doc.createRange();

				if (startToStart === BEFORE && (endToEnd === BEFORE || endToEnd === SAME)) {
					newRange.setStart(range.startContainer, range.startOffset);
					newRange.setEndAfter(node);
					range = newRange;
				}
				else if (endToEnd === AFTER && (startToStart === AFTER || startToStart === SAME)) {
					newRange.setStartBefore(node);
					newRange.setEnd(range.endContainer, range.endOffset);
					range = newRange;
				}


				if (startToEnd !== BEFORE && endToStart !== AFTER) {
					nodeList.push(this[wrap](range));
				}
			}
		}
		return nodeList.filter(x=>x);
	},


	[wrap] (range) {
		let style = this.getRecordField('style') || 'plain';
		let {ownerDocument} = range.commonAncestorContainer;
		let rangeString = range.toString();
		let sc = range.startContainer;

		//This drops entire empty ranges, anything that wraps no text is thrown out.
		if (!rangeString || /^\s+$/.test(rangeString)) {
			return;
		}

		let span = this.createNonAnchorableSpan();

		if (sc && !DOM.isTextNode(sc) && sc === range.endContainer) {
			let first = RangeUtils.getSelectedNodes(range, ownerDocument)[0];
			let s = first && getComputedStyle(first).display;

			if (/block/i.test(s)) {
				span.style.display = s;
			}
		}

		DOM.addClass(span, this.highlightCls);
		DOM.addClass(span, style);

		range.surroundContents(span);

		if (!span.firstChild) {
			DOM.removeNode(span);
			return;
		}


		// if (style !== 'suppressed') {
		// }

		return span;
	}

};
