import * as Anchors from 'nti.lib.anchorjs';

import mixin from 'nti.lib.interfaces/utils/mixin';

import Annotation from './Annotation';

import RangeWrapperMixin from './RangeWrapperMixin';

export default class Highlight extends Annotation {
	static handles (item) {
		return /highlight$/i.test(item.MimeType);
	}


	constructor (...args) {
		super(...args);

		mixin(this, RangeWrapperMixin);

		this.highlightCls = 'blue';
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
		return this.wrapRange(r.commonAncestorContainer, r);
	}
}
