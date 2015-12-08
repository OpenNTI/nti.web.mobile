import React from 'react';
import Router from 'react-router-component';

import Redirect from 'navigation/components/Redirect';

import Activity from '../Activity';
import Assignments from '../Assignments';
import PageFrame from '../PageFrame';

import Performance from './Performance';
import AssignmentView from './AssignmentView';
import AssignmentViewStudent from './AssignmentViewStudent';

const ROUTES = [
	{path: '/performance(/*)', handler: PageFrame, pageContent: Performance},
	{path: '/activity(/*)', handler: PageFrame, pageContent: Activity},
	{path: '/:rootId/:userId(/*)', handler: PageFrame, pageContent: AssignmentViewStudent},
	{path: '/:rootId(/*)', handler: PageFrame, pageContent: AssignmentView},
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
