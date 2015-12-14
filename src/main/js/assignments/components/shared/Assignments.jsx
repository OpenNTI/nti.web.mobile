import React from 'react';

import ContextSender from 'common/mixins/ContextSender';
import StoreEvents from 'common/mixins/StoreEvents';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import SearchSortStore from '../../SearchSortStore';

import AssignmentsListView from './AssignmentsListView';
import Assignment from './AssignmentViewer';
import PageFrame from './PageFrame';

export default React.createClass({
	displayName: 'Assignments',

	mixins: [ContextSender, NavigatableMixin, StoreEvents],

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string // assignmentId, present when viewing an individual assignment
	},

	backingStore: SearchSortStore,
	backingStoreEventHandlers: {
		default: 'synchronizeFromStore'
	},

	getContext () {
		return Promise.resolve({
			label: 'Assignments',
			href: this.makeHref('/')
		});
	},

	synchronizeFromStore () {
		this.forceUpdate();
	},

	render () {
		const {rootId} = this.props;
		const {assignmentsList} = SearchSortStore;
		return rootId
			? <Assignment {...this.props} pageSource={(assignmentsList || {}).pageSource} />
			: <PageFrame pageContent={AssignmentsListView} {...this.props} />;
	}
});
