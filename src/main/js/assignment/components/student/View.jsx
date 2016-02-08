import React from 'react';
import Router from 'react-router-component';
import Redirect from 'navigation/components/Redirect';
import Performance from './Performance';
import Activity from '../shared/Activity';
import Assignments from '../shared/Assignments';
import PageFrame from '../shared/PageFrame';

import AssignmentListItem from './AssignmentListItem';

const ROUTES = [
	{path: '/activity(/*)', handler: PageFrame, pageContent: Activity},
	{path: '/performance/(:rootId)(/*)', handler: Performance},
	{path: '/(:rootId)(/*)', handler: Assignments},
	{}//not found
];

export default React.createClass({
	displayName: 'Assignments:Students:View',

	childContextTypes: {
		AssignmentListItem: React.PropTypes.func
	},

	getChildContext () {
		return {AssignmentListItem};
	},

	render () {
		return React.createElement(Router.Locations, {contextual: true, ...this.props},
			...ROUTES.map(route =>
				route.path
					? React.createElement(Router.Location, route)
					: React.createElement(Router.NotFound, {handler: Redirect, location: '/'})
			));
	}
});