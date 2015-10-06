import BasePathAware from 'common/mixins/BasePath';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import path from 'path';

export default {

	mixins: [BasePathAware],

	objectLink (o) {
		let oid = objectId(o);
		let href = path.join(this.getBasePath(), 'object', encodeForURI(oid)) + '/';
		return href;
	}

};

function objectId (o) {
	return (o || {}).getID ? o.getID() : (o || {}).NTIID;
}
