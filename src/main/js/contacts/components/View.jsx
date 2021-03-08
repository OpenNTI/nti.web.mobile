import React from 'react';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';

import { Mixins } from '@nti/web-commons';
import ContextContributor from 'internal/common/mixins/ContextContributor';
import Redirect from 'internal/navigation/components/Redirect';

import Page from './PageFrame';
import Groups from './Groups';
import Users from './Users';
import ListsView from './ListsView';
import ListDetail from './ListDetail';
import CreateList from './CreateList';

const ROUTES = [
	{ path: '/users(/*)', handler: Page, pageContent: Users },
	{ path: '/groups(/*)', handler: Page, pageContent: Groups },
	{ path: '/lists/new(/*)', handler: CreateList },
	{ path: '/lists/:id(/*)', handler: ListDetail },
	{ path: '/lists(/*)', handler: Page, pageContent: ListsView },
	{}, // default
];

export default createReactClass({
	displayName: 'Contacts:View',
	mixins: [ContextContributor, Mixins.BasePath],

	getContext() {
		return Promise.resolve({
			href: this.getBasePath(),
			label: 'Home',
		});
	},

	render() {
		return React.createElement(
			Router.Locations,
			{ ref: 'router', contextual: true },
			...ROUTES.map(route =>
				route.path ? (
					<Router.Location {...route} />
				) : (
					<Router.NotFound handler={Redirect} location="/users/" />
				)
			)
		);
	},
});
