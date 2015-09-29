import React from 'react';

import Router from 'react-router-component';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import Page from './PageFrame';

import About from './About';
import Achievements from './Achievements';

import Activity from '../Activity';
import Thoughts from './Thoughts';
import Memberships from '../about/Memberships';

import Redirect from 'navigation/components/Redirect';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {join} from 'path';

const ROUTES = [
	{path: '/thoughts(/*)',			handler: Thoughts},
	{path: '/activity(/)',			handler: Activity },
	{path: '/achievements(/*)',		handler: Achievements },
	{path: '/about(/*)',			handler: About },
	{path: '/memberships(/*)',		handler: Memberships },
	{}//default
];

export default React.createClass({
	displayName: 'profile:View',
	mixins: [BasePathAware, ContextSender],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	getContext () {
		let path = this.getBasePath();
		let href = join(path, 'profile', encodeForURI(this.props.entity.getID()), '/');
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
