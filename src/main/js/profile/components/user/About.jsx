import React from 'react';
import PropTypes from 'prop-types';
import Router from 'react-router-component';
import {Loading} from '@nti/web-commons';

import Redirect from 'navigation/components/Redirect';

import Memberships from '../about/Memberships';
import ProfileBodyContainer from '../ProfileBodyContainer';
import View from '../about/View';
import Edit from '../about/Edit';

export default function About ({entity}) {
	if (!entity) {
		return <Loading.Ellipse />;
	}

	return (
		<ProfileBodyContainer className="profile-about-body">
			<Router.Locations contextual>
				<Router.Location path="/edit(/*)" entity={entity} handler={Edit} />
				<Router.Location path="/" entity={entity} handler={View} />
				<Router.NotFound handler={Redirect} location="/"/>
			</Router.Locations>

			<Memberships entity={entity} preview/>
		</ProfileBodyContainer>
	);
}

About.propTypes = {
	entity: PropTypes.object.isRequired
};
