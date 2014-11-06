'use strict';

var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');

module.exports = {
	_enrollmentOptions: function(catalogEntry) {
		var result = [];
		if (!catalogEntry) {
			return result;
		}
		var options = catalogEntry.EnrollmentOptions||{};
		Object.keys(options).forEach(function(key) {
			if(options[key].Enabled) {
				result.push({
					label: t(key)
				});
			}
		});
		return result;
	}
};
