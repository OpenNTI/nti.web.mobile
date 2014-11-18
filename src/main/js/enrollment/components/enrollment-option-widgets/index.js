'use strict';

var OpenEnrollment = require('./OpenEnrollment');
var StoreEnrollment = require('./StoreEnrollment');
// var UnrecognizedEnrollmentType = require('./UnrecognizedEnrollmentType');


module.exports = {

	getWidget: function(enrollmentOption) {
		switch(enrollmentOption.key) {
			case 'OpenEnrollment':
				return OpenEnrollment;

			case 'StoreEnrollment':
				return StoreEnrollment;

			default:
				console.warn('No enrollment widget found for option: %O', enrollmentOption);
				return null; // UnrecognizedEnrollmentType;
		}
	}

};
