import React from 'react';
import Router from 'react-router-component';
import Redirect from 'navigation/components/Redirect';
import Tabs from './Tabs';
import Performance from './Performance';
import Activity from './Activity';
import Assignments from './Assignments';

const ROUTES = [
	{path: '/performance(/*)', handler: Performance},
	{path: '/activity(/*)', handler: Activity},
	{path: '/', handler: Assignments},
	{}//not found
];

export default React.createClass({
	displayName: 'Assignments:Students:View',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		assignments: React.PropTypes.object.isRequired
	},

	render () {
		let {course, assignments} = this.props;

		return (
			<div>
				(student)
				<Tabs />
				{
					React.createElement(Router.Locations, {contextual: true},
						...ROUTES.map(route=>
							route.path ?
							React.createElement(Router.Location, Object.assign({course, assignments}, route)) :
							React.createElement(Router.NotFound, {handler: Redirect, location: '/'})
						))
				}
			</div>
		);
	}
});
