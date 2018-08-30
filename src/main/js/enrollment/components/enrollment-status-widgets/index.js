import Logger from '@nti/util-logger';

import EnrolledOpen from './EnrolledOpen';
import EnrolledLifelongLearner from './EnrolledLifelongLearner';
import EnrolledForCredit from './EnrolledForCredit';
import NotEnrolled from './NotEnrolled';
import Unknown from './Unknown';

const logger = Logger.get('enrollment-status-widgets');

const TYPES = {
	'application/vnd.nextthought.courseware.openenrollmentoption': EnrolledOpen,
	'application/vnd.nextthought.courseware.storeenrollmentoption': EnrolledLifelongLearner,
	'application/vnd.nextthought.courseware.fiveminuteenrollmentoption': EnrolledForCredit
};

export default function getWidget (catalogEntry, doNotReturnNotEnrolled) {
	if(!catalogEntry) {
		logger.error('No catalogEntry?');
		return null;
	}
	for (let option of catalogEntry.getEnrollmentOptions()) {
		if (option.enrolled) {
			return TYPES[option.MimeType] || Unknown;
		}
	}

	return !doNotReturnNotEnrolled && NotEnrolled;
}
