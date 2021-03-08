import React from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@nti/web-commons';

import ProfileBodyContainer from '../ProfileBodyContainer';

import AboutWrapper from './AboutWrapper';

export default function About({ entity }) {
	if (!entity) {
		return <Loading.Ellipse />;
	}

	return (
		<ProfileBodyContainer className="profile-about-body">
			<AboutWrapper user={entity} />
		</ProfileBodyContainer>
	);
}

About.propTypes = {
	entity: PropTypes.object.isRequired,
};
