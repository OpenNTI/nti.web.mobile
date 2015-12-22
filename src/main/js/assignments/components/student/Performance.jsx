import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import Navigatable from 'common/mixins/NavigatableMixin';

import PageFrame from '../shared/PageFrame';
import Assignment from '../shared/AssignmentViewer';

import PerformanceListView from './PerformanceListView';

export default React.createClass({
	displayName: 'Performance',

	mixins: [ContextSender, Navigatable],

	getContext () {
		return Promise.resolve({
			label: 'Performance',
			href: this.makeHref('/performance/')
		});
	},

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string // assignmentId, present when viewing an individual assignment
	},



	render () {

		const {rootId, assignments} = this.props;

		return rootId
			? <Assignment {...this.props} pageSource={assignments.getStudentSummary().getPageSource()} />
			: <PageFrame pageContent={PerformanceListView} {...this.props} />;
	}
});
