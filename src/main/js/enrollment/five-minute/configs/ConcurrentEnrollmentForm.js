/*eslint-disable*/

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var StateSelect = require('common/forms/fields').StateSelect;
var CountrySelect = require('common/forms/fields').CountrySelect;
var Constants = require('../Constants');

module.exports = Object.freeze([
	{
		fields: [
			{
				ref: Constants.IS_CONCURRENT_FORM,
				type: 'hidden',
				value: true
			},
			{
				ref: 'name',
				required: true,
				// placeholder: t('fullName'),
				label: t('name')
			},
			{
				ref: 'email',
				required: true,
				type: 'email',
				// placeholder: t('email'),
				label: t('email')
			},
			{
				ref: 'telephone_number',
				type: 'tel',
				// placeholder: t('telephone_number'),
				label: t('telephone_number')
			},
			{
				label: 'What is your date of birth?',
				ref: 'date_of_birth',
				type: 'date',
				required: true
			}
		]
	},
	{
		title: 'Address (optional)',
		fields: [
			{
				ref: 'mailing_street_line1',
				label: t('mailing_street_line1')
			},
			{
				ref: 'mailing_street_line2',
				label: t('mailing_street_line2')
			},
			{
				ref: 'city',
				label: t('city')
			},
			StateSelect.withProps({
				label: t('state'),
				required: false
			}),
			CountrySelect.withProps({
				placeholder: t('country'),
				required: false,
				label: t('country')
			}),
			{
				ref: 'postal_code',
				// placeholder: t('postal_code'),
				label: t('postal_code')
			}
		]
	},
	{
		fields: [
			{
				ref: 'contactme',
				type: 'checkbox',
				label: t('contactMe'),
				htmlLabel: true,
				value: 'Y'
			}
		]
	}
]);
