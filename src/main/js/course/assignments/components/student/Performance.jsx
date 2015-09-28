import React from 'react';
import PerformanceListView from './PerformanceListView';
import PageFrame from '../PageFrame';
import Content from '../Content';
import SearchSortStore from '../../SearchSortStore';
import ContextSender from 'common/mixins/ContextSender';

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
			? <Content {...this.props} pageSource={(assignmentsList || {}).pageSource} />
			: <PageFrame pageContent={PerformanceListView} {...this.props} />;
	}
});
