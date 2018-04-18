import Logger from '@nti/util-logger';
const logger = Logger.get('enrollment-status-widgets:Unknown');

export default function UnknownEnrollmentType () {
	logger.error('Unknown enrollment type?');
	return null;
}
