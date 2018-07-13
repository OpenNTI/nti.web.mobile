import Logger from '@nti/util-logger';

import FiveMinuteEnrollment from './FiveMinuteEnrollment';
// import UnrecognizedEnrollmentType from './UnrecognizedEnrollmentType';

const logger = Logger.get('enrollment:components:enrollment-option-widgets');

const Widgets = [
	FiveMinuteEnrollment
];

export function getWidget (enrollmentOption) {
	let widget = Widgets.reduce((found, Type) => {

		return found || (Type.handles && Type.handles(enrollmentOption) && Type);

	}, null);

	if (!widget) {
		logger.warn('No enrollment widget found for option: %O', enrollmentOption);
	}

	return widget || null;
}
