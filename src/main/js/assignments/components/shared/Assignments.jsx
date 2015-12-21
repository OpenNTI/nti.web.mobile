import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import AssignmentsListView from './AssignmentsListView';
import Assignment from './AssignmentViewer';
import PageFrame from './PageFrame';

export default React.createClass({
	displayName: 'Assignments',

	mixins: [ContextSender, NavigatableMixin],

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string // assignmentId, present when viewing an individual assignment
	},

	getContext () {
		return Promise.resolve({
			label: 'Assignments',
			href: this.makeHref('/')
		});
	},


	render () {
		const {assignments, rootId} = this.props;

		return rootId
			? <Assignment {...this.props} pageSource={assignments.getGrouppedStore().pageSource} />
			: <PageFrame pageContent={AssignmentsListView} {...this.props} />;
	}
});
