import React from 'react';

import Router from 'react-router-component';
import Redirect from 'navigation/components/Redirect';

import Loading from 'common/components/TinyLoader';

import Memberships from '../about/Memberships';
import ProfileBodyContainer from '../ProfileBodyContainer';
import View from '../about/View';
import Edit from '../about/Edit';

export default React.createClass({
	displayName: 'About',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;

		console.log('user/About');

		if (!entity) {
			return <Loading />;
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
});
