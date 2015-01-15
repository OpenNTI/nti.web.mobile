'use strict';

var Widgets = [
	require('./OpenEnrollment'),
	require('./StoreEnrollment'),
	require('./FiveMinuteEnrollment')
	//, require('./UnrecognizedEnrollmentType')
];

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
