/*eslint-disable*/

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var concurrentForm = require('./ConcurrentEnrollmentForm');
var admissionForm = require('./AdmissionForm');
var Constants = require('common/forms/Constants');

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


export default Object.freeze(highSchoolQuestion);
