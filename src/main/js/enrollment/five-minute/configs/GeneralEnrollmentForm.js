'use strict';

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var Constants = require('common/forms/Constants');
var CountryList = require('common/forms/CountryList');

var yesNoOptions = [
	{
		label: 'Yes',
		value: 'Y'
	},
	{
		label: 'No',
		value: 'N'
	}
];

var mailingAddressFieldset = {
	title: 'Mailing Address',
	fields: [
		{
			ref: 'mailAddressLabel',
			type: 'label'
		},
		{
			ref: 'mailAddress1',
			required: true,
			placeholder: t('address1')
		},
		{
			ref: 'mailAddress2',
			placeholder: t('address2')
		},
		{
			ref: 'mailCity',
			required: true,
			placeholder: t('city')
		},
		{
			ref: 'mailState',
			placeholder: t('state')
		},
		{
			ref: 'mailCountry',
			required: true,
			placeholder: t('country')
		},
		{
			ref: 'mailZip',
			required: true,
			placeholder: t('zip')
		}
	]
};

module.exports = Object.freeze([
	{
		
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
			},
			{
				ref: 'addressDifferent',
				type: 'toggleFieldset',
				label: t('mailingAddressDifferent'),
				fieldsetOn: mailingAddressFieldset
			}
		]
	},
	{
		fields: [
			{
				ref: 'phone',
				type: 'tel',
				required: true,
				placeholder: t('primaryPhone')
			},
			{
				ref: 'email',
				type: 'email',
				required: true,
				placeholder: t('primaryEmail')
			},
			{
				ref: 'ssn',
				placeholder: t('ssn')
			},
			{
				ref: 'citizen',
				type: 'radiogroup',
				label: t('citizen'),
				options: [
					{
						label: 'Yes',
						value: 'Y'
					},
					{
						label: 'No',
						value: 'N',
						related: [{
							type: Constants.SUBFIELDS,
							content: [
								{
									ref: 'residentOf',
									type: 'select',
									label: t('residentOf'),
									required: true,
									options: CountryList
								}
							]
						}]
					}
				]
			}
		]
	},
	{
		fields: [
			{
				ref: 'okResident',
				type: 'radiogroup',
				label: t('okResident'),
				options: [
					{
						label: 'Yes',
						value: 'Y',
						related: [{
							type: Constants.SUBFIELDS,
							content: [
								{
									ref: 'okResidentFor',
									label: t('okResidentFor'),
								}
							]
						}]
					},
					{
						label: 'No',
						value: 'N'
					}
				]
			},
			{
				ref: 'hsGraduate',
				type: 'radiogroup',
				label: t('hsGraduate'),
				options: yesNoOptions
			},
			{
				ref: 'attendedOU',
				type: 'radiogroup',
				label: t('attendedOU'),
				options: [
					{
						label: 'Yes',
						value: 'Y',
						related: [{
							type: Constants.SUBFIELDS,
							content: [
								{
									ref: 'soonerId',
									label: t('soonerId'),
									help: t('leaveSoonerIdBlankIfUnknown')
								}
							]
						}]
					},
					{
						label: 'No',
						value: 'N'
					}
				]
			},
			{
				ref: 'attendedAnotherUniversity',
				label: t('attendedAnotherUniversity'),
				type: 'radiogroup',
				options: [
					{
						label: 'Yes',
						value: 'Y',
						related: [{
							type: Constants.SUBFIELDS,
							content: [
								{
									ref: 'stillAttending',
									label: t('stillAttending'),
									type: 'checkbox',
									value: 'Y'
								},
								{
									ref: 'obtainedDegree',
									label: t('obtainedDegree'),
									type: 'checkbox',
									value: 'Y'
								},
								{
									ref: 'goodAcademicStanding',
									type: 'radiogroup',
									label: t('goodAcademicStanding'),
									options: yesNoOptions
								}
							]
						}]
					},
					{
						label: 'No',
						value: 'N'
					}
				]
			}
		]
	},
	{
		title: t('Signature'),
		fields: [
			{
				ref: 'signature',
				type: 'checkbox',
				label: t('signatureAgreement'),
				value: 'Y'
			}
		]
	}
]);
