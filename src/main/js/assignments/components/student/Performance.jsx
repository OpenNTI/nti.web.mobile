import React from 'react';

import ContextSender from 'common/mixins/ContextSender';

import SearchSortStore from '../../SearchSortStore';

import PageFrame from '../shared/PageFrame';
import Assignment from '../shared/AssignmentViewer';

import PerformanceListView from './PerformanceListView';

export default React.createClass({
	displayName: 'Performance',

	mixins: [ContextSender],

	getContext () {
		return Promise.resolve({
			label: 'Performance',
			href: '../'
		});
	},

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string // assignmentId, present when viewing an individual assignment
	},



	render () {

		const {rootId} = this.props;
		const {assignmentsList} = SearchSortStore;
		return rootId
			? <Assignment {...this.props} pageSource={(assignmentsList || {}).pageSource} />
			: <PageFrame pageContent={PerformanceListView} {...this.props} />;
	}
});
