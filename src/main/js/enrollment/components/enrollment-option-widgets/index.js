'use strict';

var OpenEnrollment = require('./OpenEnrollment');
var StoreEnrollment = require('./StoreEnrollment');
// var UnrecognizedEnrollmentType = require('./UnrecognizedEnrollmentType');
var Utils = require('common/Utils');

module.exports = {

	getWidget: function(enrollmentOption) {
		switch(enrollmentOption.key) {
			case 'OpenEnrollment':
				return OpenEnrollment;

			case 'StoreEnrollment':
				if(!Utils.isFlag('dev')) {
					console.info('Omitting StoreEnrollment becase we\'re not in dev');
					return null;
				}
				return StoreEnrollment;

			default:
				console.warn('No enrollment widget found for option: %O', enrollmentOption);
				return null; // UnrecognizedEnrollmentType;
		}
	}

};
