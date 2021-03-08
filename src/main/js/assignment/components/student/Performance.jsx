import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { Component as ContextSender } from 'internal/common/mixins/ContextSender';

import Assignments from '../bindings/Assignments';
import PageFrame from '../shared/PageFrame';
import Assignment from '../shared/AssignmentViewer';

import PerformanceListView from './PerformanceListView';

class Performance extends React.Component {
	static propTypes = {
		assignments: PropTypes.object,
		rootId: PropTypes.string, // assignmentId, present when viewing an individual assignment
	};

	state = {
		summary: this.props.assignments.getStudentSummary(),
	};

	render() {
		const {
			props: { rootId },
			state: { summary },
		} = this;

		return (
			<ContextSender getContext={rootId ? getContext : null}>
				{rootId ? (
					<Assignment
						{...this.props}
						pageSource={summary.getPageSource()}
					/>
				) : (
					<PageFrame
						pageContent={PerformanceListView}
						{...this.props}
					/>
				)}
			</ContextSender>
		);
	}
}

export default decorate(Performance, [Assignments.connect]);

async function getContext() {
	return {
		label: 'Performance',
		href: this.makeHref('/performance/'),
	};
}
