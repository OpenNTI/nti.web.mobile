import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'common/components/Avatar';

import HeadSummary from './HeadSummary';

export default function ProfileHead({ children, entity }) {
	return (
		<div className="profile-head user-profile">
			<div className="user">
				<div className="profile-avatar-container">
					<Avatar entity={entity} />
				</div>
				<HeadSummary entity={entity} />
			</div>
			{children}
		</div>
	);
}

ProfileHead.propTypes = {
	children: PropTypes.any,
	entity: PropTypes.any.isRequired,
};
