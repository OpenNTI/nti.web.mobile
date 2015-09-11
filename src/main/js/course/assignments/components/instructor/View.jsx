import React from 'react';
import Router from 'react-router-component';
import Redirect from 'navigation/components/Redirect';
import Tabs from '../Tabs';
import Performance from './Performance';
import Activity from '../Activity';
import Assignments from '../Assignments';
import Content from '../Content';

const ROUTES = [
	{path: '/performance(/*)', handler: Performance},
	{path: '/activity(/*)', handler: Activity},
	{path: '/:rootId(/*)', handler: Content},
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
				<Tabs className="assignments-nav button-group filters" />
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
