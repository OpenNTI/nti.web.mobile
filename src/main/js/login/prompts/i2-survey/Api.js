import {getAppUser} from 'common/utils';

import r1 from './registration.json';
import s1 from './survey.json';

const SUBMIT_REGISTRATION = 'SubmitRegistration';

function getRegistration () {
	return Promise.resolve(r1);
}

function getSurvey () {
	return Promise.resolve(s1);
}

export function loadForm () {
	return Promise.all([
		getRegistration(),
		getSurvey()
	])
		.then(([registration, survey]) => ({
			elements: [...registration.elements, ...survey.elements]
		}));
}


export function submitSurvey (data) {
	return getAppUser().then(user => user.postToLink(SUBMIT_REGISTRATION, data));
}
