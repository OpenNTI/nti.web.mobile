import {Catalog} from 'nti.lib.interfaces';

import {getService} from 'common/utils';

let catalog;

export function getCatalog(reload) {

	if (!catalog || reload) {
		catalog = getService()
			.then(service => Catalog.load(service, reload));
	}

	return catalog;
}
