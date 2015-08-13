import React from 'react';
import Router from 'react-router-component';
import Redirect from 'navigation/components/Redirect';
import Page from './PageFrame';

import Groups from './Groups';
import Users from './Users';
import ListsView from './ListsView';
import ContextContributor from 'common/mixins/ContextContributor';
import BasePathAware from 'common/mixins/BasePath';

const ROUTES = [
	{path: '/users(/*)', handler: Users},
	{path: '/groups(/*)', handler: Groups},
	{path: '/lists(/:id)(/*)', handler: ListsView},
	{} // default
];

export default React.createClass({
	displayName: 'Contacts:View',
	mixins: [ContextContributor, BasePathAware],

	getContext () {
		return Promise.resolve({
			href: this.getBasePath(),
			label: 'Home'
		});
	},

	render () {
		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
						...ROUTES.map(route =>
							route.path
							? <Router.Location {...route} handler={Page} pageContent={route.handler} />
						: <Router.NotFound handler={Redirect} location="/users/" />));
	}
});
