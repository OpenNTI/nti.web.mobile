import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import ContextSender from 'common/mixins/ContextSender';

import AssignmentsListView from './AssignmentsListView';
import Assignment from './AssignmentViewer';
import PageFrame from './PageFrame';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default createReactClass({
	displayName: 'Assignments',
	mixins: [AssignmentsAccessor, ContextSender],

	propTypes: {
		rootId: PropTypes.string // assignmentId, present when viewing an individual assignment
	},

	componentWillMount () {
		this.setState({store: this.getAssignments().getGroupedStore()});
	},


	render () {
		const {props: {rootId}, state: {store}} = this;

		return rootId
			? <Assignment {...this.props} pageSource={store.pageSource} />
			: <PageFrame pageContent={AssignmentsListView} {...this.props} />;
	}
});
