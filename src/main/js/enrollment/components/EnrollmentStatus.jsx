import './EnrollmentStatus.scss';
import PropTypes from 'prop-types';
import React from 'react';

import getWidget from './enrollment-status-widgets/';

export default function EnrollmentStatus (props) {
	const {catalogEntry, hideIfNotEnrolled} = props;
	const Widget = getWidget(catalogEntry, hideIfNotEnrolled);

	if (!Widget) { return null; }

	return (
		<div className="enrollment-status">
			<Widget catalogEntry={catalogEntry} />
		</div>
	);
}

EnrollmentStatus.displayName = 'EnrollmentStatus';

EnrollmentStatus.propTypes = {
	catalogEntry: PropTypes.object.isRequired,
	hideIfNotEnrolled: PropTypes.bool
};
