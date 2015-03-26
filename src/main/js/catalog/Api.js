import Catalog from 'nti.lib.interfaces/stores/Catalog';

import {getService} from 'common/utils';

var _catalog;

export function getCatalog(reload) {

	if (!_catalog || reload) {
		_catalog = getService()
			.then(service => Catalog.load(service, reload));
	}

	return _catalog;
}
