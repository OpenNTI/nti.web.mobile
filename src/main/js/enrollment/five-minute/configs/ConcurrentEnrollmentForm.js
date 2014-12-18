'use strict';

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var StateSelect = require('common/forms/fields').StateSelect;
var CountrySelect = require('common/forms/fields').CountrySelect;

module.exports = Object.freeze([
	{
		title: 'Concurrent Enrollment',
		fields: [
			{
				ref: 'fullName',
				required: true,
				placeholder: t('fullName')
			},
			{
				ref: 'email',
				required: true,
				type: 'email',
				placeholder: t('email')
			},
			{
				ref: 'phone',
				type: 'tel',
				placeholder: t('telephone_number')
			},
			{
				label: 'What is your date of birth?',
				ref: 'birthdate',
				type: 'date',
				required: true
			}
		]
	},
	{
		title: 'Address (optional)',
		fields: [
			{
				ref: 'mailing_street_line1'
			},
			{
				ref: 'mailing_street_line2'
			},
			{
				ref: 'city'
			},
			StateSelect.withProps({

			}),
			CountrySelect.withProps({
				placeholder: t('country')
			}),
			{
				ref: 'zip',
				placeholder: t('zip')
			}
		]
	},
	{
		fields: [
			{
				ref: 'contactme',
				type: 'checkbox',
				label: t('contactMe'),
				value: 'Y'
			}
		]
	}
]);
