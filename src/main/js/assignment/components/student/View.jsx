import React from 'react';
import PropTypes from 'prop-types';
import Router from 'react-router-component';

import Redirect from 'navigation/components/Redirect';

import Activity from '../shared/Activity';
import Assignments from '../shared/Assignments';
import PageFrame from '../shared/PageFrame';

import Performance from './Performance';
import AssignmentListItem from './AssignmentListItem';

const ROUTES = [
	{path: '/activity(/*)', handler: PageFrame, pageContent: Activity},
	{path: '/performance/(:rootId)(/*)', handler: Performance},
	{path: '/(:rootId)(/*)', handler: Assignments},
	{}//not found
];

export default class AssignmentsStudentsView extends React.Component {

	static childContextTypes = {
		AssignmentListItem: PropTypes.func
	};

	getChildContext () {
		return {AssignmentListItem};
	}

	render () {

		return React.createElement(Router.Locations, {contextual: true},
			...ROUTES.map(route =>
				route.path
					? React.createElement(Router.Location, route)
					: React.createElement(Router.NotFound, {handler: Redirect, location: '/'})
			));
	}
}
