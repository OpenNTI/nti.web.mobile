import path from 'path';

import {encodeForURI} from 'nti-lib-interfaces/lib/utils/ntiids';

import BasePathAware from './BasePath';

export default {

	mixins: [BasePathAware],

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
