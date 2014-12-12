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
			ref: 'mailingAddressLabel',
			type: 'label'
		},
		{
			ref: 'mailing_street_line1',
			required: true,
			placeholder: t('address1')
		},
		{
			ref: 'mailing_street_line2',
			placeholder: t('address2')
		},
		{
			ref: 'mailing_city',
			required: true,
			placeholder: t('city')
		},
		{
			ref: 'mailing_state',
			placeholder: t('state')
		},
		{
			ref: 'mailing_nation_code',
			required: true,
			placeholder: t('country')
		},
		{
			ref: 'mailing_postal_code',
			required: true,
			placeholder: t('zip')
		}
	]
};

module.exports = Object.freeze([
	{
		
		fields: [
			{
				ref: 'first_name',
				required: true,
				label: t('firstName')
			},
			{
				ref: 'middle_name',
				label: t('middleName')
			},
			{
				ref: 'last_name',
				required: true,
				label: t('lastName')
			},
			{
				ref: 'former_name',
				label: t('formerLastNamePrompt'),
				placeholder: t('formerLastName')
			},
			{
				ref: 'date_of_birth',
				label: t('birthdate'),
				required: true,
				type: 'date',
				placeholder: t('birthdate')
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
						value: ' '
					}
				]
			}
		]
	},
	{
		title: 'Permanent Address',
		fields: [
			{
				ref: 'street_line1',
				required: true,
				placeholder: t('address1')
			},
			{
				ref: 'street_line2',
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
				ref: 'nation_code',
				required: true,
				placeholder: t('country')
			},
			{
				ref: 'postal_code',
				required: true,
				placeholder: t('zip')
			},
			{
				ref: 'has_mailing_address',
				type: 'toggleFieldset',
				label: t('mailingAddressDifferent'),
				fieldsetOn: mailingAddressFieldset
			}
		]
	},
	{
		fields: [
			{
				ref: 'telephone_number',
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
				ref: 'social_security_number',
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
									ref: 'country_of_citizenship',
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
									ref: 'years_of_oklahoma_residency',
									required: true,
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
				ref: 'high_school_graduate',
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
									ref: 'sooner_id',
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
				ref: 'attended_other_institution',
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
									ref: 'still_attending',
									label: t('stillAttending'),
									type: 'checkbox',
									value: 'Y'
								},
								{
									ref: 'bachelors_or_higher',
									label: t('obtainedDegree'),
									type: 'checkbox',
									value: 'Y'
								},
								{
									ref: 'good_academic_standing',
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
		title: t('signature'),
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
