import Annotation from './Annotation';

import * as Anchors from 'nti.lib.anchorjs';

export default class Highlight extends Annotation {
	static handles (item) {
		return /highlight$/i.test(item.MimeType);
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

}
