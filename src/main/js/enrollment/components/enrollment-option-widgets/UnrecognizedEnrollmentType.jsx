import PropTypes from 'prop-types';
import React from 'react';
import Logger from '@nti/util-logger';

const logger = Logger.get('enrollment:components:enrollment-option-widgets:UnrecogzniedEnrollmentType');

export default class extends React.Component {
	static displayName = 'UnrecogzniedEnrollmentType';

	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
		enrollmentOption: PropTypes.object.isRequired
	};

	componentWillMount () {
		logger.warn('UnrecogzniedEnrollmentType: %s %o', this.props.enrollmentOption.key, this.props.enrollmentOption);
	}

	render () {
		return null;
	}
}
