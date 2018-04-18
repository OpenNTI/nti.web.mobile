import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';
import {FollowButton} from '@nti/web-commons';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';


import ProfileLink from './ProfileLink';

AvatarProfileLink.propTypes = {
	entity: PropTypes.any.isRequired,
	children: PropTypes.any,
	hideFollow: PropTypes.bool
};


export default function AvatarProfileLink (props) {
	let e = props.entity;

	return (
		<ProfileLink className="profile-link" entity={e}>
			<Avatar entity={e} suppressProfileLink />
			<div className="body">
				<DisplayName entity={e} suppressProfileLink />
				{e.location && <span className="location" {...rawContent(e.location)}/>}
				{props.children}
			</div>
			{(e.follow && !props.hideFollow) && <FollowButton entity={e} />}
		</ProfileLink>
	);

}
