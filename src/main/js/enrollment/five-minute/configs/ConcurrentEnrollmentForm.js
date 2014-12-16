'use strict';

var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');

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
				placeholder: t('primaryPhone')
			},
			{
				ref: 'birthdate',
				type: 'date',
				required: true
			}
		]
	}
]);
