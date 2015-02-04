import Catalog from 'dataserverinterface/stores/Catalog';

import {getService} from 'common/Utils';

var _catalog;

export function getCatalog(reload) {

	if (!_catalog || reload) {
		_catalog = getService()
			.then(service => Catalog.load(service, reload));
	}

	return _catalog;
}
