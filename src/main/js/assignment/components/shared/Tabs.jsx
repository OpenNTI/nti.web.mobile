import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {
	ActiveState,
	ActiveStateContainer,
	ListHeader as Header
} from '@nti/web-commons';

import Assignments from '../bindings/Assignments';

const t = scoped('nti-web-mobile.assignment.components.shared.Tabs', {
	heading: 'Assignments',
	assignments: 'Assignments',
	gradesAndPerformance: 'Grades & Performance',
	activity: 'Activity'
});

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
				<Header>{t('heading')}</Header>
				<ActiveStateContainer>
					<ul className="filters">
						<li><ActiveState tag="a" href="/" hasChildren>{t('assignments')}</ActiveState></li>
						<li><PerformanceLink {...PerformanceLinkProps}>{t('gradesAndPerformance')}</PerformanceLink></li>
						<li><ActivityLink {...ActivityLinkProps}>{t('activity')}</ActivityLink></li>
					</ul>
				</ActiveStateContainer>
			</div>
		);
	}
}
