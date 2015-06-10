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

		let {highlightColorName} = this.getRecordField('presentationProperties') || {};

		this.highlightCls = cx('application-highlight', {
			[highlightColorName]: highlightColorName,
			'shared-with-me': !this.isModifiable
		});

		Object.assign(this, {
			highlightColorName
		});
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


	getRange () {
		let range = this[RANGE];

		if (RangeUtils.isValidRange(range)) {
			return range;
		}

		else if (range) {
			range = this.buildRange();
			if (!RangeUtils.isValidRange(range)) {
				range = null;
			}
		}

		if (!range) {
			let {reader} = this;
			range = Anchors.toDomRange(
						this.getRecordField('applicableRange'),
						reader.getContentNode(),
						reader.getContentNodeClean(),
						this.getRecordField('ContainerId'),
						reader.getPageID()
						);
		}

		if (!range) {
			console.error('bad range', this);
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
