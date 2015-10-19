import React from 'react';

import Title from './Title';
import Description from './Description';
import Instructors from './Instructors';
import Support from './CourseSupport';

export default React.createClass({
	displayName: 'Detail',
	propTypes: {
		entry: React.PropTypes.object
	},

	render () {
		let {entry} = this.props;
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
});
