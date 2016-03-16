import React from 'react';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import FollowButton from 'common/components/FollowButton';

import ProfileLink from './ProfileLink';

export default function AvatarProfileLink (props) {
	let e = props.entity;

	return (
		<ProfileLink className="profile-link" entity={e}>
			<Avatar entity={e} suppressProfileLink />
			<div className="body">
				<DisplayName entity={e} suppressProfileLink />
				{e.location && <span className="location" dangerouslySetInnerHTML={{__html: e.location}}/>}
				{this.props.children}
			</div>
			{e.follow && <FollowButton entity={e} />}
		</ProfileLink>
	);

}

AvatarProfileLink.propTypes = {
	entity: React.PropTypes.any.isRequired,
	children: React.PropTypes.any
};
