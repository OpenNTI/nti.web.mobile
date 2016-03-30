import {getAppUser} from 'common/utils';

// import r1 from './registration.json';
import s1 from './survey.json';
import sample from './sampledata.json';

const SUBMIT_REGISTRATION = 'SubmitRegistration';
const REGISTRATION_RULES = 'RegistrationRules';

function getGrades (rules) {
	let result = {};
	// for each school in rules
	Object.keys(rules).forEach(school => {
		// for each grade in school
		Object.keys(rules[school]).forEach(grade => {
			// 		// add grade if it doesn't already exist in result
			if (!result[grade]) {
				result[grade] = {
					value: grade,
					requirement: []
				};
			}
			// add school=[school] to grade requirements
			result[grade].requirement.push('school=' + school);
		});
	});

	return Object.keys(result).map(k => result[k]);
}

function registrationViewToFormJson (input) {

	return {
		elements: [
			{
				type: 'select',
				name: 'school',
				label: 'Where do you teach?',
				required: true,
				options: Object.keys(input[REGISTRATION_RULES]).map(s => ({label: s}))
			},
			{
				type: 'radio',
				name: 'grade',
				label: 'What grade?',
				required: true,
				options: getGrades(input[REGISTRATION_RULES])
			},
			{
				type: 'select',
				name: 'course',
				label: 'Select your course',
				required: true,
				options: []
			}
		]
	};
}

function getRegistration () {

	const form = registrationViewToFormJson(sample);


	return Promise.resolve(form);
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
