import React from 'react';
import Router from 'react-router-component';
import Redirect from 'navigation/components/Redirect';
import Page from './PageFrame';

import Groups from './Groups';
import Users from './Users';
import ListsView from './ListsView';
import ListDetail from './ListDetail';
import CreateList from './CreateList';
import ContextContributor from 'common/mixins/ContextContributor';
import BasePathAware from 'common/mixins/BasePath';

const ROUTES = [
	{path: '/users(/*)', handler: Page, pageContent: Users},
	{path: '/groups(/*)', handler: Page, pageContent: Groups},
	{path: '/lists/new(/*)', handler: CreateList},
	{path: '/lists/:id(/*)', handler: ListDetail},
	{path: '/lists(/*)', handler: Page, pageContent: ListsView},
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
							? <Router.Location {...route} />
						: <Router.NotFound handler={Redirect} location="/users/" />));
	}
});
