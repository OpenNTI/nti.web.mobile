import React from 'react';
import PropTypes from 'prop-types';
import {
	ActiveState,
	ActiveStateContainer,
	ListHeader as Header
} from '@nti/web-commons';

import Assignments from '../bindings/Assignments';

export default
@Assignments.connect
class Tabs extends React.Component {

	static propTypes = {
		course: PropTypes.object.isRequired
	}


	render () {
		const {course} = this.props;
		if (!course) {return null;}

		const isAdministrative = /administrative/.test(course.PreferredAccess && course.PreferredAccess.MimeType);

		const disablePerfView = isAdministrative && !course.GradeBook;
		const disableActivityView = isAdministrative && !course.hasLink('CourseActivity');

		const PerformanceLink = disablePerfView ? 'a' : ActiveState;
		const PerformanceLinkProps = disablePerfView ? {className: 'disabled'} : {tag: 'a', href:'/performance/', hasChildren: true};
		const ActivityLink = disableActivityView ? 'a' : ActiveState;
		const ActivityLinkProps = disableActivityView ? {className: 'disabled'} : {tag: 'a', href:'/activity/'};

		return (
			<div className="assignments-nav">
				<Header>Assignments</Header>
				<ActiveStateContainer>
					<ul className="filters">
						<li><ActiveState tag="a" href="/" hasChildren>Assignments</ActiveState></li>
						<li><PerformanceLink {...PerformanceLinkProps}>Grades &amp; Performance</PerformanceLink></li>
						<li><ActivityLink {...ActivityLinkProps}>Activity</ActivityLink></li>
					</ul>
				</ActiveStateContainer>
			</div>
		);
	}
}
