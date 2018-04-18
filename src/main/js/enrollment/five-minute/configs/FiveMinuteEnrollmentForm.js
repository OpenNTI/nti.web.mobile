import isSameDay from 'date-fns/is_same_day';
import isAfter from 'date-fns/is_after';
import subYears from 'date-fns/sub_years';
import {scoped} from '@nti/lib-locale';

import * as Constants from 'forms/Constants';

import concurrentForm from './ConcurrentEnrollmentForm';
import admissionForm from './AdmissionForm';

const t = scoped('enrollment.forms.fiveminute', {
	'attendedAnotherUniversity':    'Have you ever attended another college or university?',
	'attendingHighschool':          'Are you currently attending high school?',
	'concurrentFormIntro':          '<h2>You may qualify for concurrent enrollment.<h2><p>Through Concurrent Enrollment (CE), high school juniors and seniors can enroll in college classes and earn college credit while still in high school. Submit your contact info and date of birth below and a Concurrent Enrollment Counselor will be in touch to guide you through the <a href="http://www.ou.edu/concurrent/admission.html">Concurrent Enrollment Process.</a></p>',
	'currentlyAttending':           'Are you currently attending the University of Oklahoma?',
	'goodAcademicStanding':         'I am in good academic standing.',
	'goodAcademicStandingRequired': 'The class you are attempting to enroll in is a For-Credit Janux course. Only students who are currently in good academic standing may enroll in for credit Janux courses.',
	'historyEnrollViaOzone':        'Please sign up for the course using your <a href="http://ozone.ou.edu" target="_blank">Ozone</a> account. Note: not all Janux courses are available for credit to OU students.',
	'obtainedDegree':               'I have obtained a Bachelor’s degree or higher.',
	'oklahomaResident':             'Are you an Oklahoma resident?',
	'stillAttending':               'I am still attending.',
	'under13':                      'Persons under the age of 13 may not enroll in this course.',
});

//XXX: using the locale function this way will not pickup site string changes after loading...

let okResidentQuestion = [{
	fields: [
		{
			ref: 'oklahoma_resident',
			type: 'radiogroup',
			required: true,
			label: t('oklahomaResident'),
			options: [
				{
					label: 'Yes',
					value: 'Y',
					related: [
						{
							type: Constants.MESSAGE,
							content: t('concurrentFormIntro')
						},
						{
							type: Constants.FORM_CONFIG,
							content: concurrentForm
						}
					]
				},
				{
					label: 'No',
					value: 'N',
					related: [
						{
							type: Constants.FORM_CONFIG,
							content: admissionForm
						}
					]
				}
			]
		}
	]
}];

let highSchoolQuestion = [{
	fields: [
		{
			ref: 'attending-highschool',
			type: 'radiogroup',
			required: true,
			label: t('attendingHighschool'),
			options: [
				{
					label: 'Yes',
					value: 'Y',
					related: [
						{
							type: Constants.FORM_CONFIG,
							content: okResidentQuestion
						}
					]
				},
				{
					label: 'No',
					value: 'N',
					related: [
						{
							type: Constants.FORM_CONFIG,
							content: admissionForm
						}
					]
				}
			]
		}
	]
}];

const otherUniversityQuestion = [{
	fields: [
		{
			ref: 'attended_other_institution',
			label: t('attendedAnotherUniversity'),
			type: 'radiogroup',
			required: true,
			options: [
				{
					label: 'Yes',
					value: 'Y',
					related: [{
						type: Constants.SUBFIELDS,
						content: [
							{
								ref: 'still_attending',
								label: t('stillAttending'),
								type: 'checkbox',
								value: 'Y'
							},
							{
								ref: 'bachelors_or_higher',
								label: t('obtainedDegree'),
								type: 'checkbox',
								value: 'Y'
							},
							{
								ref: 'good_academic_standing',
								type: 'radiogroup',
								label: t('goodAcademicStanding'),
								options: [
									{
										label: 'Yes',
										value: 'Y',
										related: [
											{
												type: Constants.FORM_CONFIG,
												content: highSchoolQuestion
											}
										]
									},
									{
										label: 'No',
										value: 'N',
										related: [
											{
												type: Constants.MESSAGE,
												content: t('goodAcademicStandingRequired')
											}
										]
									}
								]
							}
						]
					}]
				},
				{
					label: 'No',
					value: 'N',
					related: [{
						type: Constants.FORM_CONFIG,
						content: highSchoolQuestion
					}]
				}
			]
		}
	]
}];

let attendingOU = [{
	// title: 'Admission Status',
	fields: [
		{
			ref: 'is_currently_attending_ou',
			type: 'radiogroup',
			required: true,
			label: t('currentlyAttending'),
			options: [
				{
					label: 'Yes',
					value: 'Y',
					related: [{
						type: Constants.MESSAGE,
						content: t('historyEnrollViaOzone')
					}]
				},
				{
					label: 'No',
					value: 'N',
					related: [{
						type: Constants.FORM_CONFIG,
						content: otherUniversityQuestion
					}]
				}
			]
		}
	]
}];

const birthdateQuestion = [{
	fields: [
		{
			ref: 'date_of_birth',
			type: 'date',
			required: true,
			label: t('date_of_birth'),
			predicateFunc (value) {
				const thirteenYearsAgo = subYears(new Date, 13);
				return isSameDay(thirteenYearsAgo, value) || isAfter(thirteenYearsAgo, value);
			},
			ifTrue: [
				{
					type: Constants.FORM_CONFIG,
					content: attendingOU
				}
			],
			ifFalse: [
				{
					type: Constants.MESSAGE,
					content: t('under13')
				}
			]
		}
	]
}];

export default Object.freeze(birthdateQuestion);
