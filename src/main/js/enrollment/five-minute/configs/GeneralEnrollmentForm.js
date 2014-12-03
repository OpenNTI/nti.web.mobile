'use strict';

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');

var mailingAddressFieldset = {
	title: 'Permanent Address',
	fields: [
		{
			ref: 'mail:address1',
			required: true,
			placeholder: t('address1')
		},
		{
			ref: 'mail:address2',
			placeholder: t('address2')
		},
		{
			ref: 'mail:city',
			required: true,
			placeholder: t('city')
		},
		{
			ref: 'mail:state',
			placeholder: t('state')
		},
		{
			ref: 'mail:country',
			required: true,
			placeholder: t('country')
		},
		{
			ref: 'mail:zip',
			required: true,
			placeholder: t('zip')
		}
	]
}

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
				placeholder: t('address2')
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
	},
	{
		title: 'Mailing Address',
		fields: [
			{
				ref: 'addressDifferent',
				type: 'toggleFieldset',
				label: t('mailingAddressDifferent'),
				fieldsetOn: mailingAddressFieldset
			}
		]
	}
]);
