import React from 'react';

import Loading from 'common/components/Loading';

import ShowAvatars from './mixins/ShowAvatarsContainer';
import Accessor from './mixins/AssignmentSummaryAccessor';

import AssignmentHeader from './AssignmentHeader';
import GradebookTable from './gradebook-table/GradebookTable';

export default React.createClass({
	displayName: 'instructor:AssignmentView',

	mixins: [ShowAvatars, Accessor],

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		rootId: React.PropTypes.string.isRequired
	},


	render () {
		const assignment = this.getAssignment();
		const Store = this.getStore();
		const props = { assignment, ...this.props };

		if(!Store || Store.loading) {
			return <Loading />;
		}


		return (
			<div className="assignment-gradebook-wrapper">
				<AssignmentHeader {...props} />
				<GradebookTable {...props} />
			</div>
		);
	}
});
