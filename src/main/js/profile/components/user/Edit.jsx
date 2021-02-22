import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@nti/web-commons';

import ProfileBodyContainer from '../ProfileBodyContainer';

import EditWrapper from './EditWrapper';

export default function Edit({ entity }) {
	if (!entity) {
		return <Loading.Ellipse />;
	}

	return (
		<ProfileBodyContainer className="profile-edit-body">
			<EditWrapper user={entity} />
		</ProfileBodyContainer>
	);
}

Edit.propTypes = {
	entity: PropTypes.object.isRequired,
};
