import React from 'react';
import Logger from 'nti-util-logger';

const logger = Logger.get('enrollment:components:enrollment-option-widgets:UnrecogzniedEnrollmentType');

export default class extends React.Component {
    static displayName = 'UnrecogzniedEnrollmentType';

    static propTypes = {
		catalogEntry: React.PropTypes.object.isRequired,
		enrollmentOption: React.PropTypes.object.isRequired
	};

    componentWillMount() {
		logger.warn('UnrecogzniedEnrollmentType: %s %o', this.props.enrollmentOption.key, this.props.enrollmentOption);
	}

    render() {
		return null;
	}
}
