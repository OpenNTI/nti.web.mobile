'use strict';

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var concurrentForm = require('./ConcurrentEnrollmentForm');
var generalForm = require('./GeneralEnrollmentForm');
var Constants = require('common/forms/Constants');

var attendingOU = [{
	title: 'Admission Status',
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
						content: 'LSTD 1153.500 fulfills US History Gen Ed requirement. To enroll, visit ' +
						'<a href="htttp://ozone.ou.edu" target="_blank">ozone.ou.edu</a> and enroll in LSTD 1153, Section 500.'
					}]
				},
				{
					label: 'No',
					value: 'N',
					related: [{
						type: Constants.FORM_CONFIG,
						content: generalForm
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
			label: t('oklahomaResidentHighSchool'),
			options: [
				{
					label: 'Yes',
					value: 'Y',
					related: [
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
