/*eslint-disable*/

var t = require('nti-lib-locale').scoped('ENROLLMENT.forms.fiveminute');
var Constants = require('forms/Constants');
var StateSelect = require('forms/fields').StateSelect;
var CountrySelect = require('forms/fields').CountrySelect;


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
			label: t('street_line1'),
			required: true,
			// placeholder: t('address1')
		},
		{
			ref: 'mailing_street_line2',
			label: t('street_line2'),
			// placeholder: t('address2')
		},
		{
			ref: 'mailing_city',
			label: t('city'),
			required: true,
			// placeholder: t('city')
		},
		StateSelect.withProps({
			label: t('state'),
			required: false,
			ref: 'mailing_state'
		}),
		CountrySelect.withProps({
			label: t('country'),
			ref: 'mailing_nation_code',
			required: true,
			// placeholder: t('country')
		}),
		{
			label: t('zip'),
			ref: 'mailing_postal_code',
			// placeholder: t('zip')
		}
	]
};

const admissionForm = [
	{
		fields: [
			{
				ref: 'first_name',
				required: true,
				label: t('first_name')
			},
			{
				ref: 'middle_name',
				label: t('middle_name')
			},
			{
				ref: 'last_name',
				required: true,
				label: t('last_name')
			},
			{
				ref: 'former_name',
				label: t('former_name'),
				// placeholder: t('former_name')
			},
			{
				ref: 'gender',
				type: 'radiogroup',
				required: true,
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
				label: t('street_line1'),
				required: true,
				// placeholder: t('address1')
			},
			{
				ref: 'street_line2',
				label: t('street_line2'),
				// placeholder: t('address2')
			},
			{
				ref: 'city',
				label: t('city'),
				required: true,
				// placeholder: t('city')
			},
			StateSelect.withProps({
				label: t('state'),
				ref: 'state',
				required: false
			}),
			CountrySelect.withProps({
				label: t('country'),
				ref: 'nation_code',
				required: true,
				// placeholder: t('country')
			}),
			{
				ref: 'postal_code',
				label: t('postal_code'),
				// placeholder: t('postal_code')
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
				label: t('telephone_number')
			},
			{
				ref: 'email',
				type: 'email',
				required: true,
				label: t('email')
			},
			{
				ref: 'social_security_number',
				type: 'ssn',
				label: t('social_security_number'),
				helptext: t('ssn_helptext')
			},
			{
				ref: 'citizen',
				type: 'radiogroup',
				required: true,
				label: t('citizen'),
				options: [
					{
						label: 'Yes',
						value: 'Y',
						related: [{
							type: Constants.SUBFIELDS,
							content: [
								{
									type: 'hidden',
									ref: 'country_of_citizenship',
									defaultValue: 'United States'
								}
							]
						}]
					},
					{
						label: 'No',
						value: 'N',
						related: [{
							type: Constants.SUBFIELDS,
							content: [
								CountrySelect.withProps({
									ref: 'country_of_citizenship',
									label: t('residentOf'),
									required: true
								})
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
									type: 'number',
									label: t('years_of_oklahoma_residency'),
									// placeholder: t('years_of_oklahoma_residency_placeholder')
								}
							]
						}]
					},
					{
						label: 'No',
						value: 'N',
						related: [{
							type: Constants.SUBFIELDS,
							content: [
								{
									type: 'hidden',
									ref: 'years_of_oklahoma_residency',
									defaultValue: "0"
								}
							]
						}]
					}
				]
			},
			{
				ref: 'high_school_graduate',
				type: 'radiogroup',
				required: true,
				label: t('hsGraduate'),
				options: yesNoOptions
			},
			{
				ref: 'attendedOU',
				type: 'radiogroup',
				required: true,
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
									label: t('sooner_id')
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
				htmlLabel: true,
				value: 'Y'
			}
		]
	}
];

module.exports = admissionForm;
