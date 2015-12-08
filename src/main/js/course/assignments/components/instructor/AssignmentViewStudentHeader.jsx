import React from 'react';

import AvatarProfileLink from 'profile/components/AvatarProfileLink';

import ActionsMenu from './ActionsMenu';
import GradeBox from './GradeBox';

export default React.createClass({
	displayName: 'instructor:AssignmentViewStudentHeader',

	propTypes: {
		userId: React.PropTypes.any.isRequired,
		rootId: React.PropTypes.string.isRequired
	},

	render () {

		const {userId, rootId} = this.props;

		const props = {
			assignmentId: rootId,
			userId
		};

		return (
			<div className="assignment-header">
				<AvatarProfileLink entity={userId} />
				<div className="controls">
					<GradeBox {...props} />
					<ActionsMenu {...props} />
				</div>
			</div>
		);
	}
});
