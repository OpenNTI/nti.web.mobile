import moment from 'moment';

const t = require('nti-lib-locale').scoped('ENROLLMENT.forms.fiveminute');
const concurrentForm = require('./ConcurrentEnrollmentForm');
const admissionForm = require('./AdmissionForm');
const Constants = require('forms/Constants');

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
							content: 'ENROLLMENT.forms.fiveminute.concurrentFormIntro'
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
												content: 'ENROLLMENT.forms.fiveminute.goodAcademicStandingRequired'
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
						content: 'ENROLLMENT.forms.fiveminute.historyEnrollViaOzone'
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
			predicateFunc: function is13 (value) {
				return moment().subtract(13, 'years').isSameOrAfter(value);
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
					content: 'ENROLLMENT.forms.fiveminute.under13'
				}
			]
		}
	]
}];

export default Object.freeze(birthdateQuestion);
