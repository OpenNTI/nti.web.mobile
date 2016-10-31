import React from 'react';
import ForumView from 'forums/components/ForumView';

ProfileForumView.propTypes = {
	entity: React.PropTypes.object.isRequired
};

export default function ProfileForumView ({entity, ...props}) {
	return (
		<div className="profile-forums forums-wrapper"><ForumView contextID={entity.getID()} {...props} /></div>
	);
}
