import React from 'react';

import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import Navigatable from 'common/mixins/NavigatableMixin';

import ShowAvatars from './mixins/ShowAvatarsContainer';
import Accessor from './mixins/AssignmentSummaryAccessor';

import AssignmentHeader from './AssignmentHeader';
import GradebookTable from './gradebook-table/GradebookTable';

export default React.createClass({
	displayName: 'instructor:AssignmentView',

	mixins: [Accessor, ContextSender, Navigatable, ShowAvatars],

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string.isRequired
	},


	getContext () {
		const {rootId} = this.props;
		const assignment = this.getAssignment();
		return {
			label: assignment.title || 'Assignment',
			ntiid: assignment.getID(),
			href: this.makeHref(rootId + '/students/')
		};
	},


	render () {
		const assignment = this.getAssignment();
		const Store = this.getStore();
		const props = { assignment, ...this.props };

		if(!Store || Store.loading) {
			return <Loading />;
		}


		return (
			<div>
				<AssignmentHeader {...props} />
				<GradebookTable {...props} />
			</div>
		);
	}
});
