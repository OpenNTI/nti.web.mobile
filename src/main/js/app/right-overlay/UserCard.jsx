import './UserCard.scss';
import React from 'react';

import { getAppUsername } from '@nti/web-client';
import { scoped } from '@nti/lib-locale';
import DisplayName from 'internal/common/components/DisplayName';
import Avatar from 'internal/common/components/Avatar';
import ProfileLink from 'internal/profile/components/ProfileLink';

const t = scoped('app.user-overlay.user-card', {
	viewProfile: 'View Profile',
});

export default function UserCard() {
	const entity = getAppUsername();

	return (
		<div className="nti-mobile-user-card">
			<Avatar entity={entity} />
			<div className="info">
				<DisplayName
					className="user-card-display-name"
					entity={entity}
				/>
				<ProfileLink entity={entity} className="user-card-profile-link">
					{t('viewProfile')}
				</ProfileLink>
			</div>
		</div>
	);
}
