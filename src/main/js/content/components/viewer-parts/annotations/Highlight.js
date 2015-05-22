import cx from 'classnames';

import * as Anchors from 'nti.lib.anchorjs';

import mixin from 'nti.lib.interfaces/utils/mixin';

import Annotation from './Annotation';

import RangeWrapperMixin from './RangeWrapperMixin';

const RENDERED = Symbol('highlight elements');

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
		let node = this.reader.getContentNode();
		let doc = node && node.ownerDocument;
		let range = doc && doc.createRange();

		let elements = this[RENDERED];

		if (elements && elements.length > 0) {
			try {
				range.setStartBefore(elements[0]);
				range.setEndAfter(elements[elements.length - 1]);

			}
			catch (e) {
				console.error(e.stack || e.message || e);
			}
		}

		return range;
	}


	getRange () {
		let {reader} = this;
		let range = Anchors.toDomRange(
						this.getRecordField('applicableRange'),
						reader.getContentNode(),
						reader.getContentNodeClean(),
						this.getRecordField('ContainerId'),
						reader.getPageID()
						);

		if (!range) {
			console.error('bad range', this);
			return null;
		}

		//console.log(this.id,': ',(this.getRecordField('body')||[]).join('|'), ': got range from description:', range, range.toString());
		Anchors.expandRangeToIncludeMath(range);
		return range;
	}


	render () {
		let r = this.getRange();
		if (!r) { return; }

		if (this[RENDERED]) { return; }

		this[RENDERED] = this.wrapRange(r.commonAncestorContainer, r);
	}
}
