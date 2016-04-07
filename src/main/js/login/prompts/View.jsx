import React from 'react';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';
import Redirect from 'navigation/components/Redirect';

import Terms from './terms/components/View';
import Survey from './survey/components/View';

export default function View () {
	return (
		<Locations contextual>
			<Location path="/tos(/*)" handler={Terms} />
			<Location path="/survey(/*)" handler={Survey} />
			<Location path="/i2-survey(/*)" handler={Survey} />

			<DefaultRoute handler={Redirect} location="/" />
		</Locations>
	);
}
