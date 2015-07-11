import BasePathAware from 'common/mixins/BasePath';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import path from 'path';

const exclude = RegExp.prototype.test.bind(/(personalblogentry|communityheadlinetopic)$/i);

export default {

	mixins: [BasePathAware],

	objectLink(o) {
		if (!(o || {}).NTIID || exclude((o || {}).MimeType)) {
			return null;
		}
		let href = path.join(this.getBasePath(), 'object', encodeForURI(o.NTIID)) + '/';
		return href;
	}

};

