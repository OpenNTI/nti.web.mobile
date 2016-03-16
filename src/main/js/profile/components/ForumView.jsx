import React from 'react';
import ForumView from 'forums/components/ForumView';

export default function ProfileForumView (props) {
	return (
		<div className="profile-forums forums-wrapper"><ForumView {...props} /></div>
	);
}
