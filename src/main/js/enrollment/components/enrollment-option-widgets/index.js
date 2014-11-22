'use strict';

var OpenEnrollment = require('./OpenEnrollment');
var StoreEnrollment = require('./StoreEnrollment');
var FiveMinuteEnrollment = require('./FiveMinuteEnrollment');
// var UnrecognizedEnrollmentType = require('./UnrecognizedEnrollmentType');


module.exports = {

	getWidget: function(enrollmentOption) {
		switch(enrollmentOption.key) {
			case 'OpenEnrollment':
				return OpenEnrollment;

			case 'StoreEnrollment':
				return StoreEnrollment;

			case 'FiveminuteEnrollment': // augh. wonky camel case.
				return FiveMinuteEnrollment;

			default:
				console.warn('No enrollment widget found for option: %O', enrollmentOption);
				return null; // UnrecognizedEnrollmentType;
		}
	}

};
