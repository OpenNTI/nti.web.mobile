import {getService} from 'common/utils';
import FieldValuesStore from 'common/forms/FieldValuesStore';

/*eslint-disable camelcase*/
let valuesMap = {
};

class Autopopulator {

	constructor() {
		getService().then(service => {
			service.getAppUser().then(user => {
				valuesMap.first_name = user.NonI18NFirstName;
				valuesMap.last_name = user.NonI18NLastName;
				valuesMap.email = user.email;
			});
		});
	}

	valueFor(fieldName) {
		return valuesMap[fieldName] || (typeof this[fieldName] === 'function' ? this[fieldName]() : undefined);
	}

	['okResident']() { // the second time we ask if you're an oklahoma resident it should be pre-filled with the answer you gave the first time.
		return FieldValuesStore.getValue('oklahoma_resident');
	}

	['high_school_graduate']() { // if you're still attending high school you're probably not a high school graduate.
		return FieldValuesStore.getValue('is_currently_attending_highschool') === 'Y' ? 'N' : undefined;
	}

}

export default new Autopopulator();
