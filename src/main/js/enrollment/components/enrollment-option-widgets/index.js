'use strict';

var isFlag = require('common/Utils').isFlag;

var Widgets = [
	require('./OpenEnrollment'),
	require('./StoreEnrollment')
	//, require('./UnrecognizedEnrollmentType')
];

if (isFlag('fiveMinuteEnabled')) {
	Widgets.push(require('./FiveMinuteEnrollment'));
}

module.exports = {

	getWidget: function(enrollmentOption) {
		var widget = Widgets.reduce((found, Type)=>{

			return found || (Type.handles && Type.handles(enrollmentOption) && Type);

		}, null);

		if (!widget) {
			console.warn('No enrollment widget found for option: %O', enrollmentOption);
		}

		return widget || null;
	}

};
