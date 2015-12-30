import React from 'react';
import Router from 'react-router-component';

import Redirect from 'navigation/components/Redirect';

import Activity from '../shared/Activity';
import Assignments from '../shared/Assignments';

import PageFrame from '../shared/PageFrame';

import Performance from './performance/View';
import PerformanceViewStudent from './performance/Student.jsx';
import AssignmentView from './AssignmentView';

import AssignmentViewForStudent from './AssignmentViewForStudent';
import AssignmentViewForStudentPerf from './performance/AssignmentViewForStudent';

import AssignmentListItem from './AssignmentListItem';

const ROUTES = [
	{path: '/performance/:userId/:rootId(/*)', handler: PageFrame, pageContent: AssignmentViewForStudentPerf},
	{path: '/performance/:userId(/*)', handler: PageFrame, pageContent: PerformanceViewStudent},
	{path: '/performance(/*)', handler: PageFrame, pageContent: Performance},
	{path: '/activity(/*)', handler: PageFrame, pageContent: Activity},
	{path: '/:rootId/students/:userId(/*)', handler: PageFrame, pageContent: AssignmentViewForStudent},
	{path: '/:rootId/students(/*)', handler: PageFrame, pageContent: AssignmentView},
	{path: '/(:rootId)(/*)', handler: Assignments},
	{}//not found
];

export default React.createClass({
	displayName: 'Assignments:Instructor:View',

	childContextTypes: {
		AssignmentListItem: React.PropTypes.func
	},

	getChildContext () {
		return {AssignmentListItem};
	},

	render () {
		return (
			<div>
				{
					React.createElement(Router.Locations, {contextual: true},
						...ROUTES.map(route =>
							route.path ?
							<Router.Location {...route} />
							: React.createElement(Router.NotFound, {handler: Redirect, location: '/'})
						))
				}
			</div>
		);
	}
});
