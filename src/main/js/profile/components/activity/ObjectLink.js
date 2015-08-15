import BasePathAware from 'common/mixins/BasePath';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import path from 'path';

export default {

	mixins: [BasePathAware],

	objectLink (o) {
		if (!(o || {}).NTIID) {
			return null;
		}
		let href = path.join(this.getBasePath(), 'object', encodeForURI(o.NTIID)) + '/';
		return href;
	}

};
