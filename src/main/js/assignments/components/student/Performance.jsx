import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import Navigatable from 'common/mixins/NavigatableMixin';

import PageFrame from '../shared/PageFrame';
import Assignment from '../shared/AssignmentViewer';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

import PerformanceListView from './PerformanceListView';

export default React.createClass({
	displayName: 'Performance',

	mixins: [AssignmentsAccessor, ContextSender, Navigatable],

	getContext () {
		return Promise.resolve({
			label: 'Performance',
			href: this.makeHref('/performance/')
		});
	},

	propTypes: {
		rootId: React.PropTypes.string // assignmentId, present when viewing an individual assignment
	},


	componentWillMount () {
		this.setState({summary: this.getAssignments().getStudentSummary()});
	},


	render () {
		const {props: {rootId}, state: {summary}} = this;

		return rootId
			? <Assignment {...this.props} pageSource={summary.getPageSource()} />
			: <PageFrame pageContent={PerformanceListView} {...this.props} />;
	}
});