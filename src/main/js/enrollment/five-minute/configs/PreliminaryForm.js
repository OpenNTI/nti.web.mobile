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
						value: 'Y'
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
