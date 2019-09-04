import React from 'react';
import PropTypes from 'prop-types';
import {encodeForURI} from '@nti/lib-ntiids';

import Redirect from '../../../navigation/components/Redirect';

CommunityProfileView.propTypes = {
	entity: PropTypes.shape({
		getID: PropTypes.func.isRequired
	}).isRequired
};
export default function CommunityProfileView ({entity}) {
	const location = `/community/${encodeForURI(entity.getID())}`;

	return (
		<Redirect location={location} absolute />
	);
}