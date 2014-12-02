'use strict';

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');

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
							type: 'message',
							content: 'LSTD 1153.500 fulfills US History Gen Ed requirement. To enroll, visit ' +
							'<a href="htttp://ozone.ou.edu" target="_blank">ozone.ou.edu</a> and enroll in LSTD 1153, Section 500.'
						}]
					},
					{
						label: 'No',
						value: 'N'
					}
				]
			},
			{
				ref: 'oklahomaResident',
				type: 'radiogroup',
				label: t('oklahomaResident'),
				options: [
					{
						label: 'Yes',
						value: 'Y'
					},
					{
						label: 'No',
						value: 'N'
					}
				]
			}
		]
	}
]);
