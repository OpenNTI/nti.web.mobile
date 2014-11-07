'use strict';

var OpenEnrollment = require('./OpenEnrollment');

module.exports = {

	getWidget: function(enrollmentOption) {
		switch(enrollmentOption.key) {
			case 'OpenEnrollment':
				return OpenEnrollment;

			default:
				console.warn('No enrollment widget found for option: %O', enrollmentOption);

		}
	}

};
