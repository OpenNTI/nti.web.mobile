import PropTypes from 'prop-types';
import React from 'react';

import DisplayName from 'common/components/DisplayName';

import Subhead from './Subhead';
import Description from './Description';
import InvitationCode from './InvitationCode';

export default function GroupHead({ children, entity }) {
	return (
		<div className="profile-head">
			<div className="group">
				<div className="label">
					<DisplayName entity={entity} />
					<Subhead entity={entity} />
					<InvitationCode entity={entity} />
				</div>
				<Description entity={entity} />
			</div>
			{children}
		</div>
	);
}

GroupHead.propTypes = {
	children: PropTypes.any,
	entity: PropTypes.object,
};
