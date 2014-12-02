'use strict';

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var concurrentForm = require('./ConcurrentEnrollmentForm');
var generalForm = require('./GeneralEnrollmentForm');
var Constants = require('common/components/forms/mixins/Constants');

var highSchoolQuestion = [{
	fields: [
		{
			ref: 'oklahomaResidentHighSchool',
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
							content: generalForm
						}
					]
				}
			]
		}
	]
}];

module.exports = Object.freeze([
	{
		title: 'Admission Status',
		fields: [
			{
				ref: 'currentlyAttending',
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
							content: highSchoolQuestion
						}]
					}
				]
			}
		]
	}
]);
