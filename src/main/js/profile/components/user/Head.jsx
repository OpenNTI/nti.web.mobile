import React from 'react';

import Avatar from 'common/components/Avatar';
import HeadSummary from './HeadSummary';

export default function ProfileHead ({children, entity}) {
	return (
		<div className="profile-head user-profile">
			<div className="user">
				<div className="profile-avatar-container">
					<Avatar entity={entity}/>
				</div>
				<HeadSummary entity={entity} />
			</div>
			{children}
		</div>
	);
}

ProfileHead.propTypes = {
	children: React.PropTypes.any,
	entity: React.PropTypes.any.isRequired
};
