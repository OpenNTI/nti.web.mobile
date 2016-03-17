import React from 'react';

import AvatarProfileLink from 'profile/components/AvatarProfileLink';

export default function StudentHeader ({userId}) {
	return (
		<div className="student-header">
			<AvatarProfileLink entity={userId} />
		</div>
	);
}

StudentHeader.propTypes = {
	userId: React.PropTypes.any.isRequired
};
