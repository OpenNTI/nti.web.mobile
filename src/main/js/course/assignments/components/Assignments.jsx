import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import ContextContributor from 'common/mixins/ContextContributor';
import StoreEvents from 'common/mixins/StoreEvents';

import SearchSortStore from '../SearchSortStore';

import AssignmentsListView from './AssignmentsListView';
import Assignment from './AssignmentViewer';
import PageFrame from './PageFrame';

export default React.createClass({
	displayName: 'Assignments',

	mixins: [ContextContributor, StoreEvents],

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
		const {rootId} = this.props;
		return Promise.resolve({
			label: 'Assignments',
			ntiid: decodeFromURI(rootId),
			href: this.makeHref(rootId)
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
