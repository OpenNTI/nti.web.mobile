import React from 'react';

import AvatarProfileLink from 'profile/components/AvatarProfileLink';

import ActionsMenu from './ActionsMenu';

export default React.createClass({
	displayName: 'instructor:AssignmentViewStudentHeader',

	propTypes: {
		userId: React.PropTypes.any.isRequired
	},

	render () {

		const {userId} = this.props;

		return (
			<div className="assignment-header">
				<AvatarProfileLink entity={userId} />
				<div className="controls">
					<ActionsMenu {...this.props} />
				</div>
			</div>
		);
	}
});
