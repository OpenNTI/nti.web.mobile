import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';
import StoreEvents from 'common/mixins/StoreEvents';
import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import ShowAvatars from './mixins/ShowAvatarsContainer';

import {GRADEBOOK_BY_ASSIGNMENT_UNLOADED} from '../../GradebookConstants';
import GradebookStore from '../../GradebookStore';
import * as GradebookActions from '../../GradebookActions';

import AssignmentHeader from './AssignmentHeader';
import GradebookTable from './gradebook-table/GradebookTable';

export default React.createClass({
	displayName: 'instructor:AssignmentView',

	mixins: [ShowAvatars, ContextSender, NavigatableMixin, StoreEvents],

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string.isRequired
	},

	backingStore: GradebookStore,
	backingStoreEventHandlers: {
		[GRADEBOOK_BY_ASSIGNMENT_UNLOADED]: 'reload',
		default: 'synchronizeFromStore'
	},

	getContext () {
		const {rootId} = this.props;
		return Promise.resolve({
			label: 'Assignment!',
			ntiid: decodeFromURI(rootId),
			href: this.makeHref(rootId) + '/'
		});
	},

	componentWillMount () {
		this.load();
	},

	componentWillReceiveProps (nextProps) {
		this.load(nextProps);
	},

	synchronizeFromStore () {
		this.forceUpdate();
	},

	reload () {
		this.load();
	},

	load (props = this.props) {
		const {assignments, rootId} = props;
		const assignment = assignments.getAssignment(decodeFromURI(rootId));
		this.setState({assignment});
		GradebookActions.load(assignment);
	},

	render () {

		if(!GradebookStore.isLoaded) {
			return <Loading />;
		}

		const {gradeBookByAssignment} = GradebookStore;
		const {assignment} = this.state;

		return (
			<div className="assignment-gradebook-wrapper">
				<AssignmentHeader assignment={assignment} />
				<GradebookTable assignment={assignment} items={gradeBookByAssignment.Items || []} />
			</div>
		);
	}
});
