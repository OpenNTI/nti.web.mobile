import React from 'react';

import {ActiveState, Mixins, TopicHeader as Header} from 'nti-web-commons';

import Accessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'Tabs',
	mixins: [Accessor, Mixins.ActiveStateSelector],

	render () {
		const course = this.getCourse();

		const disablePerfView = course.isAdministrative && !course.GradeBook;

		const PerformanceViewTag = disablePerfView ? 'a' : ActiveState;
		const PerformanceViewProps = disablePerfView ? {className: 'disabled'} : {tag: 'a', href:'/performance/', hasChildren: true};

		return (
			<div className="assignments-nav">
				<Header>Assignments</Header>
				<ul className="filters">
					<li><ActiveState tag="a" href="/" hasChildren>Assignments</ActiveState></li>
					<li><PerformanceViewTag {...PerformanceViewProps}>Grades &amp; Performance</PerformanceViewTag></li>
					<li><ActiveState tag="a" href="/activity/">Activity</ActiveState></li>
				</ul>
			</div>
		);
	}
});
