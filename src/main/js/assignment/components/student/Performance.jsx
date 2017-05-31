import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import ContextSender from 'common/mixins/ContextSender';
import {Mixins} from 'nti-web-commons';

import PageFrame from '../shared/PageFrame';
import Assignment from '../shared/AssignmentViewer';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

import PerformanceListView from './PerformanceListView';

export default createReactClass({
	displayName: 'Performance',

	mixins: [AssignmentsAccessor, ContextSender, Mixins.NavigatableMixin],

	getContext () {
		return Promise.resolve({
			label: 'Performance',
			href: this.makeHref('/performance/')
		});
	},

	propTypes: {
		rootId: PropTypes.string // assignmentId, present when viewing an individual assignment
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
