import {join} from 'path';

import React from 'react';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';

import ContextSender from 'common/mixins/ContextSender';
import NotFoundPage from 'notfound/components/View';

import ProfileLink from '../../mixins/ProfileLink';

import BlogEntry from './BlogEntryDetail';


const ROUTES = [
	{path: '/(:id)(/*)', handler: BlogEntry },
	{}//default
];

export default createReactClass({
	displayName: 'Thoughts',
	mixins: [ContextSender, ProfileLink],


	getContext () {
		return {
			href: join(this.profileHref(), 'activity/'),
			label: 'Activity'
		};
	},

	render () {
		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
			...ROUTES.map(route=>
				route.path ? (
					<Router.Location {...route}
						handler={route.handler}
						{...this.props}
					/>
				) : (
					<Router.NotFound handler={NotFoundPage} />
				)
			));
	}
});
