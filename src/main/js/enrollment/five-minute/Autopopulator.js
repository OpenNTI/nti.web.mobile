import {getService} from 'common/utils';
import FieldValuesStore from 'common/forms/FieldValuesStore';

/*eslint-disable camelcase*/
let valuesMap = {
};

class Autopopulator {

	constructor() {
		getService().then(service => {
			service.getAppUser().then(user => {
				console.debug(user);
				valuesMap.first_name = user.NonI18NFirstName;
				valuesMap.last_name = user.NonI18NLastName;
				valuesMap.email = user.email;
			});
		});
	}

	valueFor(fieldName) {
		return valuesMap[fieldName] || (typeof this[fieldName] === 'function' ? this[fieldName]() : undefined);
	}

	['okResident']() {
		return FieldValuesStore.getValue('oklahoma_resident');
	}

}

export default new Autopopulator();
