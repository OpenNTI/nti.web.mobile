

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var concurrentForm = require('./ConcurrentEnrollmentForm');
var admissionForm = require('./AdmissionForm');
var Constants = require('common/forms/Constants');

var attendingOU = [{
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

var highSchoolQuestion = [{
	fields: [
		{
			ref: 'is_currently_attending_highschool',
			type: 'radiogroup',
			required: true,
			label: t('oklahomaResidentHighSchool'),
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

module.exports = Object.freeze(highSchoolQuestion);
