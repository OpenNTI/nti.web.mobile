//XXX: using the locale function this way will not pickup site string changes after loading...
//FIXME: Move string uages `t()` to the component's render method.
import { scoped } from '@nti/lib-locale';

import * as Constants from 'forms/Constants';
import { StateSelect, CountrySelect } from 'forms/fields';

const t = scoped('enrollment.forms.fiveminute', {
	first_name: 'First Name',
	middle_name: 'Middle Name',
	last_name: 'Last Name',
	former_name: 'What is your former last name?',
	date_of_birth: 'Birthdate',
	genderPrompt: 'What is your gender?',

	social_security_number: 'Social Security Number',
	ssn_helptext:
		'Your social security number is not requried for admission, but it is used for submission of a <a href="http://www.irs.gov/uac/Form-1098-T,-Tuition-Statement">1098T</a> to the IRS.',

	street_line1: 'Address',
	street_line2: 'Address Continued',
	address1: 'Address',
	address2: 'Address Continued',
	city: 'City',
	state: 'State',
	postal_code: 'Zip',
	zip: 'Zip',
	nation_code: 'Country',
	country: 'Country',

	telephone_number: 'Phone Number',
	email: 'Email Address',

	mailing_address_different: 'My mailing address is different.',
	mailingAddressLabel: 'Mailing Address',
	mailing_street_line1: 'Address',
	mailing_street_line2: 'Address Continued',
	mailing_city: 'City',
	mailing_state: 'State',
	mailing_postal_code: 'Zip',
	mailing_nation_code: 'Country',

	citizen: 'Are you a U.S. citizen?',
	resident_of: 'I am a resident of',
	ok_resident: 'Are you a resident of Oklahoma?',
	years_of_oklahoma_residency:
		'How many years have you been an Oklahoma resident?',
	years_of_oklahoma_residency_placeholder: 'How many years?',

	hs_graduate: 'Are you a high school graduate?',
	attended_ou: 'Have you ever attended the University of Oklahoma?',
	sooner_id:
		'What was your Sooner ID? (Leave this field blank if you do not remember.)',

	signature: 'Signature',
	signature_agreement:
		'I affirm that I am not <a href="policy/">prohibited</a> from enrolling in any University of Oklahoma program. I understand that submitting any false information to the University, including but not limited to, any information contained on this form, or withholding information about my previous academic history will make my application for admission to the University, as well as any future applications, subject to denial, or will result in expulsion from the University. I pledge to conduct myself with academic integrity and abide by the tenets of The University of Oklahoma’s <a href="http://integrity.ou.edu/" target="_blank">Integrity Pledge.</a>',
});

const yesNoOptions = [
	{
		label: 'Yes',
		value: 'Y',
	},
	{
		label: 'No',
		value: 'N',
	},
];

const mailingAddressFieldset = {
	title: 'Mailing Address',
	fields: [
		{
			ref: 'mailingAddressLabel',
			type: 'label',
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
			ref: 'mailing_state',
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
		},
	],
};

export default [
	{
		fields: [
			{
				ref: 'first_name',
				required: true,
				label: t('first_name'),
			},
			{
				ref: 'middle_name',
				label: t('middle_name'),
			},
			{
				ref: 'last_name',
				required: true,
				label: t('last_name'),
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
						value: 'M',
					},
					{
						label: 'Female',
						value: 'F',
					},
					{
						label: 'Prefer not to disclose',
						value: ' ',
					},
				],
			},
		],
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
				required: false,
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
				label: t('mailing_address_different'),
				fieldsetOn: mailingAddressFieldset,
			},
		],
	},
	{
		fields: [
			{
				ref: 'telephone_number',
				type: 'tel',
				required: true,
				label: t('telephone_number'),
			},
			{
				ref: 'email',
				type: 'email',
				required: true,
				label: t('email'),
			},
			{
				ref: 'social_security_number',
				type: 'ssn',
				label: t('social_security_number'),
				helptext: t('ssn_helptext'),
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
						related: [
							{
								type: Constants.SUBFIELDS,
								content: [
									{
										type: 'hidden',
										ref: 'country_of_citizenship',
										defaultValue: 'United States',
									},
								],
							},
						],
					},
					{
						label: 'No',
						value: 'N',
						related: [
							{
								type: Constants.SUBFIELDS,
								content: [
									CountrySelect.withProps({
										ref: 'country_of_citizenship',
										label: t('resident_of'),
										required: true,
									}),
								],
							},
						],
					},
				],
			},
		],
	},
	{
		fields: [
			{
				ref: 'okResident',
				type: 'radiogroup',
				label: t('ok_resident'),
				required: true,
				options: [
					{
						label: 'Yes',
						value: 'Y',
						related: [
							{
								type: Constants.SUBFIELDS,
								content: [
									{
										ref: 'years_of_oklahoma_residency',
										required: true,
										type: 'number',
										label: t('years_of_oklahoma_residency'),
										// placeholder: t('years_of_oklahoma_residency_placeholder')
									},
								],
							},
						],
					},
					{
						label: 'No',
						value: 'N',
						related: [
							{
								type: Constants.SUBFIELDS,
								content: [
									{
										type: 'hidden',
										ref: 'years_of_oklahoma_residency',
										defaultValue: '0',
									},
								],
							},
						],
					},
				],
			},
			{
				ref: 'high_school_graduate',
				type: 'radiogroup',
				required: true,
				label: t('hs_graduate'),
				options: yesNoOptions,
			},
			{
				ref: 'attendedOU',
				type: 'radiogroup',
				required: true,
				label: t('attended_ou'),
				options: [
					{
						label: 'Yes',
						value: 'Y',
						related: [
							{
								type: Constants.SUBFIELDS,
								content: [
									{
										ref: 'sooner_id',
										label: t('sooner_id'),
									},
								],
							},
						],
					},
					{
						label: 'No',
						value: 'N',
					},
				],
			},
		],
	},
	{
		title: t('signature'),
		fields: [
			{
				ref: 'signature',
				type: 'checkbox',
				label: t('signature_agreement'),
				htmlLabel: true,
				value: 'Y',
			},
		],
	},
];
