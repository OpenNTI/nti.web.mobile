import React from 'react';

import Title from './Title';
import Description from './Description';
import Instructors from './Instructors';
import Support from './CourseSupport';

Detail.propTypes = {
	entry: React.PropTypes.object
};

export default function Detail ({entry}) {
	return (
		<div className="course-detail-view">
			<Title entry={entry} />
			<Description entry={entry} />
			<Instructors entry={entry}/>
			<Support entry={entry}/>
			<div className="footer"/>
		</div>
	);
}
