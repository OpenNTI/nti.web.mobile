import React from 'react';
import Router from 'react-router-component';
import Redirect from 'navigation/components/Redirect';
import Page from './PageFrame';

import Groups from './Groups';
import Users from './Users';
import DistributionLists from './DistributionLists';

const ROUTES = [
	{path: '/users(/*)', handler: Users},
	{path: '/groups(/*)', handler: Groups},
	{path: '/lists(/*)', handler: DistributionLists},
	{} // default
];

export default React.createClass({
	displayName: 'Contacts:View',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {
		let {entity} = this.props;

		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
						...ROUTES.map(route =>
							route.path
							? <Router.Location {...route} handler={Page} pageContent={route.handler} entity={entity} />
						: <Router.NotFound handler={Redirect} location="/users/" />));
	}
});
