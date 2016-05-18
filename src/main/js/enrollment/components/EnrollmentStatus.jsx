import React from 'react';

import getWidget from './enrollment-status-widgets/';

export default function EnrollmentStatus (props) {
	const {catalogEntry} = props;
	const Widget = getWidget(catalogEntry);

	return (
		<div className="enrollment-status">
			<Widget catalogEntry={catalogEntry} />
		</div>
	);
}

EnrollmentStatus.displayName = 'EnrollmentStatus';

EnrollmentStatus.propTypes = {
	catalogEntry: React.PropTypes.object.isRequired
};
