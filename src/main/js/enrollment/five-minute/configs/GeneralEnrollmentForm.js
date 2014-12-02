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
			}
		]
	}
]);
