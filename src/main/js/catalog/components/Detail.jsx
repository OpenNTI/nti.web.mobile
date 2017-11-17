import PropTypes from 'prop-types';
import React from 'react';
import { Info } from 'nti-web-course';

import Support from './CourseSupport';

Detail.propTypes = {
	entry: PropTypes.object
};

export default function Detail ({entry}) {
	return (
		<div className="course-detail-view">
			<Info catalogEntry={entry}/>
			<Support entry={entry}/>
			<div className="footer"/>
		</div>
	);
}
