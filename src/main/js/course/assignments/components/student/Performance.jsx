import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
// import StoreEvents from 'common/mixins/StoreEvents';

import SearchSortStore from '../../SearchSortStore';

import PageFrame from '../PageFrame';
import Assignment from '../AssignmentViewer';

import PerformanceListView from './PerformanceListView';

export default React.createClass({
	displayName: 'Performance',

	mixins: [ContextSender/*, StoreEvents*/],

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

	// backingStore: SearchSortStore,
	// backingStoreEventHandlers: {
	// 	default: 'synchronizeFromStore'
	// },
	//
	//
	// synchronizeFromStore () {
	// 	this.forceUpdate();
	// },

	render () {

		const {rootId} = this.props;
		const {assignmentsList} = SearchSortStore;
		return rootId
			? <Assignment {...this.props} pageSource={(assignmentsList || {}).pageSource} />
			: <PageFrame pageContent={PerformanceListView} {...this.props} />;
	}
});
