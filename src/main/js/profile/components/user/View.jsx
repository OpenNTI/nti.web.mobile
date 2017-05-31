import React from 'react';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';

import ContextSender from 'common/mixins/ContextSender';

import Redirect from 'navigation/components/Redirect';

import Page from './PageFrame';
import About from './About';
import Achievements from './Achievements';

import Activity from '../Activity';
import Thoughts from './Thoughts';
import Memberships from '../about/Memberships';

import ProfileLink from '../../mixins/ProfileLink';

const ROUTES = [
	{path: '/thoughts(/*)',			handler: Thoughts},
	{path: '/activity(/)',			handler: Activity },
	{path: '/achievements(/*)',		handler: Achievements },
	{path: '/about(/*)',			handler: About },
	{path: '/memberships(/*)',		handler: Memberships },
	{}//default
];

export default createReactClass({
	displayName: 'profile:View',
	mixins: [ProfileLink, ContextSender],

	propTypes: {
		entity: React.PropTypes.object.isRequired
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


	render () {
		let {entity} = this.props;

		if (!entity) {
			return null;
		}

		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
			...ROUTES.map(route=>
				route.path ?
				<Router.Location {...route}
					handler={Page} pageContent={route.handler}
					entity={entity}
					/> :
				<Router.NotFound handler={Redirect} location="/about/"/>
			));
	}
});
