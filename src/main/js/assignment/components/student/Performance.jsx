import React from 'react';
import PropTypes from 'prop-types';

import {Component as ContextSender} from 'common/mixins/ContextSender';

import Assignments from '../bindings/Assignments';
import PageFrame from '../shared/PageFrame';
import Assignment from '../shared/AssignmentViewer';

import PerformanceListView from './PerformanceListView';

export default
@Assignments.connect
class Performance extends React.Component {

	static propTypes = {
		assignments: PropTypes.object,
		rootId: PropTypes.string // assignmentId, present when viewing an individual assignment
	}


	componentWillMount () {
		this.setState({summary: this.props.assignments.getStudentSummary()});
	}


	render () {
		const {props: {rootId}, state: {summary}} = this;

		return (
			<ContextSender getContext={getContext}>
				{rootId ? (
					<Assignment {...this.props} pageSource={summary.getPageSource()} />
				) : (
					<PageFrame pageContent={PerformanceListView} {...this.props} />
				)}
			</ContextSender>
		);
	}
}

async function getContext () {
	return {
		label: 'Performance',
		href: this.makeHref('/performance/')
	};
}
