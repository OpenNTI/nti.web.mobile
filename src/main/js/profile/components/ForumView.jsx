import React from 'react';
import PropTypes from 'prop-types';

import ForumView from 'internal/forums/components/ForumView';

ProfileForumView.propTypes = {
	entity: PropTypes.object.isRequired,
};

export default function ProfileForumView({ entity, ...props }) {
	return (
		<div className="profile-forums forums-wrapper">
			<ForumView contextID={entity.getID()} {...props} />
		</div>
	);
}
