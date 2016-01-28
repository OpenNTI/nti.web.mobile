import React from 'react';

import AvatarProfileLink from 'profile/components/AvatarProfileLink';

export default React.createClass({
	displayName: 'instructor:performance:StudentHeader',

	propTypes: {
		userId: React.PropTypes.any.isRequired
	},

	render () {

		const {userId} = this.props;

		return (
			<div className="student-header">
				<AvatarProfileLink entity={userId} />
			</div>
		);
	}
});
