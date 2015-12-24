import React from 'react';

import ContextSender from 'common/mixins/ContextSender';

import AssignmentsListView from './AssignmentsListView';
import Assignment from './AssignmentViewer';
import PageFrame from './PageFrame';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'Assignments',
	mixins: [AssignmentsAccessor, ContextSender],

	propTypes: {
		rootId: React.PropTypes.string // assignmentId, present when viewing an individual assignment
	},

	componentWillMount () {
		this.setState({store: this.getAssignments().getGrouppedStore()});
	},


	render () {
		const {props: {rootId}, state: {store}} = this;

		return rootId
			? <Assignment {...this.props} pageSource={store.pageSource} />
			: <PageFrame pageContent={AssignmentsListView} {...this.props} />;
	}
});
