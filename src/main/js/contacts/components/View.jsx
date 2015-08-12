import React from 'react';
import Router from 'react-router-component';
import Redirect from 'navigation/components/Redirect';
import Page from './PageFrame';

import Groups from './Groups';
import Users from './Users';
import DistributionLists from './DistributionLists';
import ListDetail from './ListDetail';

const ROUTES = [
	{path: '/users(/*)', handler: Users},
	{path: '/groups(/*)', handler: Groups},
	{path: '/lists(/:id)', handler: ListDetail},
	{path: '/lists(/*)', handler: DistributionLists},
	{} // default
];

export default React.createClass({
	displayName: 'Contacts:View',

	render () {
		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
						...ROUTES.map(route =>
							route.path
							? <Router.Location {...route} handler={Page} pageContent={route.handler} />
						: <Router.NotFound handler={Redirect} location="/users/" />));
	}
});
