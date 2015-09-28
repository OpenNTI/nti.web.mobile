import React from 'react';
import SearchSortStore from '../SearchSortStore';
import Content from './Content';
import PageFrame from './PageFrame';
import AssignmentsListView from './AssignmentsListView';
import ContextContributor from 'common/mixins/ContextContributor';

export default React.createClass({
	displayName: 'Assignments',

	mixins: [ContextContributor],

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string // assignmentId, present when viewing an individual assignment
	},

	componentDidMount () {
		SearchSortStore.addChangeListener(this.onStoreChanged);
	},

	componentWillUnmount () {
		SearchSortStore.removeChangeListener(this.onStoreChanged);
	},

	onStoreChanged () {
		this.forceUpdate();
	},

	render () {
		const {rootId} = this.props;
		const {assignmentsList} = SearchSortStore;
		return rootId
			? <Content {...this.props} pageSource={(assignmentsList || {}).pageSource} />
			: <PageFrame pageContent={AssignmentsListView} {...this.props} />;
	}
});
