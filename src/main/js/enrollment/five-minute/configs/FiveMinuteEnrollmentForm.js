import moment from 'moment';

const t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
const concurrentForm = require('./ConcurrentEnrollmentForm');
const admissionForm = require('./AdmissionForm');
const Constants = require('common/forms/Constants');

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
						content: admissionForm
					}]
				}
			]
		}
	]
}];


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
							content: attendingOU
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
							content: attendingOU
						}
					]
				}
			]
		}
	]
}];

const birthdateQuestion = [{
	fields: [
		{
			ref: 'date-of-birth',
			type: 'date',
			required: true,
			label: t('date_of_birth'),
			predicateFunc: function is13 (value) {
				return moment().subtract(13, 'years').isSameOrAfter(value);
			},
			ifTrue: [
				{
					type: Constants.FORM_CONFIG,
					content: highSchoolQuestion
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
