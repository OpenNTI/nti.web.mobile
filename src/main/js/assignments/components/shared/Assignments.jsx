import React from 'react';

import ContextSender from 'common/mixins/ContextSender';

import AssignmentsListView from './AssignmentsListView';
import Assignment from './AssignmentViewer';
import PageFrame from './PageFrame';

export default React.createClass({
	displayName: 'Assignments',

	mixins: [ContextSender],

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string // assignmentId, present when viewing an individual assignment
	},


	render () {
		const {assignments, rootId} = this.props;

		return rootId
			? <Assignment {...this.props} pageSource={assignments.getGrouppedStore().pageSource} />
			: <PageFrame pageContent={AssignmentsListView} {...this.props} />;
	}
});
