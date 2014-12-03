'use strict';

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');

module.exports = Object.freeze([
	{
		title: 'Enrollment Application',
		fields: [
			{
				ref: 'fullName',
				required: true,
				label: t('fullName')
			},
			{
				ref: 'formerLastName',
				label: t('formerLastNamePrompt'),
				placeholder: t('formerLastName')
			},
			{
				ref: 'gender',
				type: 'radiogroup',
				label: t('genderPrompt'),
				options: [
					{
						label: 'Male',
						value: 'M'
					},
					{
						label: 'Female',
						value: 'F'
					},
					{
						label: 'Prefer not to disclose',
						value: null
					}
				]
			}
		]
	},
	{
		title: 'Permanent Address',
		fields: [
			{
				ref: 'address1',
				required: true,
				placeholder: t('address1')
			},
			{
				ref: 'address2',
				placeholder: t('address1')
			},
			{
				ref: 'city',
				required: true,
				placeholder: t('city')
			},
			{
				ref: 'state',
				placeholder: t('state')
			},
			{
				ref: 'country',
				required: true,
				placeholder: t('country')
			},
			{
				ref: 'zip',
				required: true,
				placeholder: t('zip')
			}
		]
	}
]);
