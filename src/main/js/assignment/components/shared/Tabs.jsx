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

		const disablePerfView = course.isAdministrative && !course.GradeBook;

		const PerformanceLink = disablePerfView ? 'a' : ActiveState;
		const PerformanceLinkProps = disablePerfView ? {className: 'disabled'} : {tag: 'a', href:'/performance/', hasChildren: true};

		return (
			<div className="assignments-nav">
				<Header>Assignments</Header>
				<ActiveStateContainer>
					<ul className="filters">
						<li><ActiveState tag="a" href="/" hasChildren>Assignments</ActiveState></li>
						<li><PerformanceLink {...PerformanceLinkProps}>Grades &amp; Performance</PerformanceLink></li>
						<li><ActiveState tag="a" href="/activity/">Activity</ActiveState></li>
					</ul>
				</ActiveStateContainer>
			</div>
		);
	}
}
