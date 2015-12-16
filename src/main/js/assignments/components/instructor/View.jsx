import React from 'react';
import Router from 'react-router-component';

import Redirect from 'navigation/components/Redirect';

import Activity from '../shared/Activity';
import Assignments from '../shared/Assignments';
import PageFrame from '../shared/PageFrame';

import Performance from './performance/View';
import PerformanceViewStudent from './performance/Student.jsx';
import AssignmentView from './AssignmentView';
import AssignmentViewStudent from './AssignmentViewStudent';

const ROUTES = [
	{path: '/performance/:userId/:rootId(/*)', handler: PageFrame, pageContent: AssignmentViewStudent},
	{path: '/performance/:userId(/*)', handler: PageFrame, pageContent: PerformanceViewStudent},
	{path: '/performance(/*)', handler: PageFrame, pageContent: Performance},
	{path: '/activity(/*)', handler: PageFrame, pageContent: Activity},
	{path: '/:rootId/students/:userId(/*)', handler: PageFrame, pageContent: AssignmentViewStudent},
	{path: '/:rootId/students(/*)', handler: PageFrame, pageContent: AssignmentView},
	{path: '/', handler: Assignments},
	{}//not found
];

export default React.createClass({
	displayName: 'Assignments:Instructor:View',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		assignments: React.PropTypes.object.isRequired
	},

	render () {

		let {course, assignments} = this.props;

		return (
			<div>
				{
					React.createElement(Router.Locations, {contextual: true},
						...ROUTES.map(route =>
							route.path ?
							<Router.Location {...route}
								contentPackage={course}
								course={course}
								assignments={assignments}
							/>
							: React.createElement(Router.NotFound, {handler: Redirect, location: '/'})
						))
				}
			</div>
		);
	}
});
