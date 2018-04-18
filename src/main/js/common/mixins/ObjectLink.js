import path from 'path';

import {encodeForURI} from '@nti/lib-ntiids';
import {Mixins} from '@nti/web-commons';

export default {

	mixins: [Mixins.BasePath],

	objectLink (o) {
		let oid = objectId(o);
		let href = path.join(this.getBasePath(), 'object', encodeForURI(oid)) + '/';
		return href;
	}

};

function objectId (object) {
	const o = (object || {});
	return o.getContentId
		? o.getContentId()
		: o.getID
			? o.getID()
			: o.NTIID;
}
