import cx from 'classnames';

import * as Anchors from 'nti.lib.anchorjs';
import * as RangeUtils from 'nti.lib.ranges';

import mixin from 'nti.lib.interfaces/utils/mixin';

import Annotation, {RENDERED} from './Annotation';

import RangeWrapperMixin from './RangeWrapperMixin';

const RANGE = Symbol('cached range');

export default class Highlight extends Annotation {
	static handles (item) {
		return /highlight$/i.test(item.MimeType);
	}


	constructor (...args) {
		super(...args);

		mixin(this, RangeWrapperMixin);

		this.setupDomClassNames();
	}


	setupDomClassNames () {
		let {highlightColorName} = this.getRecordField('presentationProperties') || {};
		let style = this.getRecordField('style') || 'plain';

		this.highlightCls = cx('application-highlight', highlightColorName, style, {
			'shared-with-me': !this.isModifiable,
			'colored': highlightColorName
		});

		Object.assign(this, {
			highlightColorName
		});
	}


	createNonAnchorableSpan () {
		let span = super.createNonAnchorableSpan();
		span.setAttribute('class', this.highlightCls);
		return span;
	}
	buildRange () {
		let doc = this.getDocument();
		let range = doc && doc.createRange();

		let elements = this[RENDERED];

		if (elements && elements.length > 0) {
			let a = elements[0];
			let b = elements[elements.length - 1];

			try {
				range.setStartBefore(a);
				range.setEndAfter(b);
			}
			catch (e) {
				console.error(e.stack || e.message || e);
			}
		}

		return range;
	}


	hadValidRange () {
		let {reader} = this;
		let range = this[RANGE];
		let contentNode = reader.getContentNode();

		return range && !RangeUtils.isValidRange(range, contentNode);
	}


	getRange () {
		let {reader} = this;
		let range = this[RANGE];
		let hadRange = !!range;
		let contentNode = reader.getContentNode();

		if (RangeUtils.isValidRange(range, contentNode)) {
			return range;
		}

		else if (range) {
			range = this.buildRange();
			if (!RangeUtils.isValidRange(range, contentNode)) {
				range = null;
			}
		}

		if (!range) {
			range = Anchors.toDomRange(
						this.getRecordField('applicableRange'),
						contentNode,
						reader.getContentNodeClean(),
						this.getRecordField('ContainerId'),
						reader.getPageID()
						);
		}

		if (!range) {
			if (!hadRange) {
				console.error('bad range', this);
			}

			return null;
		}

		//console.log(this.id,': ',(this.getRecordField('body')||[]).join('|'), ': got range from description:', range, range.toString());
		Anchors.expandRangeToIncludeImmutableBlocks(range);

		this[RANGE] = range;
		return range;
	}


	shouldRender () {
		let n = this.reader.getContentNode();
		let elements = this[RENDERED];
		if (n && (!elements || elements.some(e => !n.contains(e)))) {
			delete this[RENDERED];
			if (elements) {
				delete this[RANGE];
			}
			return true;
		}
	}


	render () {
		if (!this.shouldRender()) { return; }

		let r = this.getRange();
		if (!r) {
			return;
		}


		this[RENDERED] = this.wrapRange(r.commonAncestorContainer, r);
		return true;
	}
}
