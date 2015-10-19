import {getService} from 'common/utils';
import FieldValuesStore from 'common/forms/FieldValuesStore';

/*eslint-disable camelcase*/
let valuesMap = {
};

export default class Autopopulator {

	constructor () {
		try {
			getService().then(service => {
				service.getAppUser().then(user => {
					valuesMap.first_name = user.NonI18NFirstName;
					valuesMap.last_name = user.NonI18NLastName;
					valuesMap.email = user.email;
				});
			});
		} catch (e) {
			console.error(e.stack || e.message || e);
		}
	}

	valueFor (fieldName) {
		return valuesMap[fieldName] || (typeof this[fieldName] === 'function' ? this[fieldName]() : undefined);
	}

	['okResident'] () { // the second time we ask if you're an oklahoma resident it should be pre-filled with the answer you gave the first time.
		return FieldValuesStore.getValue('oklahoma_resident');
	}

	['high_school_graduate'] () { // if you're still attending high school you're probably not a high school graduate.
		return FieldValuesStore.getValue('attending-highschool') === 'Y' ? 'N' : undefined;
	}

	preprocess (values) {
		// let okhs = 'ok-highschool-student';
		// if (values[okhs] === undefined) {
		// 	let hs = values.is_currently_attending_highschool === 'Y';
		// 	let ok = values.okResident === 'Y';
		// 	values[okhs] = hs && ok ? 'Y' : 'N';
		// }
		return values;
	}

}
