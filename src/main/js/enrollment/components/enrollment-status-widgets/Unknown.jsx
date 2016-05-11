import React from 'react';
import Logger from 'nti-util-logger';
const logger = Logger.get('enrollment-status-widgets:Unknown');

export default React.createClass({
	displayName: 'UnknownEnrollmentType',

	render () {
		logger.error('Unknown enrollment type?');
		return null;
	}
});
