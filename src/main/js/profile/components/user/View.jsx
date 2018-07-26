import React from 'react';
import PropTypes from 'prop-types';
import {User} from '@nti/web-client';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';

import ContextSender from 'common/mixins/ContextSender';
import Redirect from 'navigation/components/Redirect';

import ProfileLink from '../../mixins/ProfileLink';
import Memberships from '../about/Memberships';
import Activity from '../Activity';

import Page from './PageFrame';
import About from './About';
import Achievements from './Achievements';
import Thoughts from './Thoughts';
import Transcripts from './Transcripts';


const ROUTES = [
	{path: '/thoughts(/*)',			handler: Thoughts},
	{path: '/activity(/)',			handler: Activity },
	{path: '/achievements(/*)',		handler: Achievements },
	{path: '/about(/*)',			handler: About },
	{path: '/transcripts(/*)',      handler: Transcripts},
	{path: '/memberships(/*)',		handler: Memberships },
	{}//default
];

export default createReactClass({
	displayName: 'profile:View',
	mixins: [ProfileLink, ContextSender],

	propTypes: {
		entity: PropTypes.object.isRequired,
		isMe: PropTypes.bool
	},

	getInitialState () {
		return {};
	},

	getContext () {
		const path = this.getBasePath();
		const href = this.profileHref();
		return Promise.resolve([
			{
				href: path, label: 'Home'
			}, {
				href,
				label: 'Profile'
			}
		]);
	},


	getIsMeRedirect () {
		const {entity} = this.props;
		const pathname = global.location && global.location.pathname;
		const base = this.getBasePath();

		if (!pathname || !entity) {
			return false;
		}

		return `${base}profile/${User.encode(entity.Username)}/${pathname.replace(`${base}profile/me/`, '')}`;
	},


	render () {
		let {entity, isMe} = this.props;
		let redirect = this.getIsMeRedirect();

		if (!entity) {
			return null;
		}

		if (isMe && redirect) {
			return (
				<Redirect location={redirect} force />
			);
		}

		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
			...ROUTES.map(route=>
				route.path ? (
					<Router.Location {...route}
						handler={Page} pageContent={route.handler}
						entity={entity}
					/>
				) : (
					<Router.NotFound handler={Redirect} location="/about/"/>
				)
			));
	}
});
