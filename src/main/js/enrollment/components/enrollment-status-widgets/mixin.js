import {join} from 'path';
import {encodeForURI} from 'nti-lib-ntiids';

export default {

	enrollmentHref (basePath, catalogEntry) {
		return join(basePath, 'catalog', 'item', encodeForURI(catalogEntry.getID()), 'enrollment' );
	}

};
