import React from 'react'; 
// import PropTypes from 'prop-types';
import Router from 'react-router-component';

import Community from './View';

const ROUTES = [
	{path: '/:channel/:topic(/*)', handler: Community},
	{path: '/:channel(/*)', handler: Community},
	{path: '/', handler: Community}
];

export default function MobileCourseCommunityRoutes (props) {
	return (
		<Router.Locations contextual>
			{
				ROUTES.map((route) => {
					return (
						<Router.Location key={route.path} {...props} {...route} />
					);
				})
			}
		</Router.Locations>
	);
}