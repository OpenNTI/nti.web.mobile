import React from 'react';
// import Router from 'react-router-component';
// import Redirect from 'navigation/components/Redirect';
// import Performance from './Performance';
// import Activity from '../Activity';
// import Assignments from '../Assignments';
// import Content from '../Content';
// import PageFrame from '../PageFrame';
import Notice from 'common/components/Notice';

// const ROUTES = [
// 	{path: '/performance(/*)', handler: PageFrame, pageContent: Performance},
// 	{path: '/activity(/*)', handler: PageFrame, pageContent: Activity},
// 	{path: '/:rootId(/*)', handler: Content},
// 	{path: '/', handler: PageFrame, pageContent: Assignments},
// 	{}//not found
// ];

export default React.createClass({
	displayName: 'Assignments:Instructor:View',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		assignments: React.PropTypes.object.isRequired
	},

	render () {

		return <Notice>Coming Soon</Notice>;

		// let {course, assignments} = this.props;
		//
		// return (
		// 	<div>
		// 		{
		// 			React.createElement(Router.Locations, {contextual: true},
		// 				...ROUTES.map(route =>
		// 					route.path ?
		// 					<Router.Location {...route}
		// 						contentPackage={course}
		// 						course={course}
		// 						assignments={assignments}
		// 					/>
		// 					: React.createElement(Router.NotFound, {handler: Redirect, location: '/'})
		// 				))
		// 		}
		// 	</div>
		// );
	}
});
