import React from 'react';

import Title from './Title';
import Description from './Description';
import Instructors from './Instructors';

export default React.createClass({
	displayName: 'Detail',
	propTypes: {
		entry: React.PropTypes.object
	},

	render () {
		var {entry} = this.props;
		return (
			<div className="course-detail-view">
				<Title entry={entry} />
				<Description entry={entry} />
				<Instructors entry={entry}/>
				<div className="footer"/>
			</div>
		);
	}
});
