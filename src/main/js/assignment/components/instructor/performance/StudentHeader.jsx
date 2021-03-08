import './StudentHeader.scss';
import PropTypes from 'prop-types';
import React from 'react';

import AvatarProfileLink from 'internal/profile/components/AvatarProfileLink';

export default function StudentHeader({ userId }) {
	return (
		<div className="student assignment-header">
			<AvatarProfileLink entity={userId} />
		</div>
	);
}

StudentHeader.propTypes = {
	userId: PropTypes.any.isRequired,
};
