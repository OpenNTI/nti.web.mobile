import Library from 'nti.lib.interfaces/stores/Library';

import {getService} from 'common/utils';

export function getLibrary (reload) {
	return getService()
			.then(service => Library.get(service, 'Main', reload));
}
