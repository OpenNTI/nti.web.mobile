import React from 'react';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';
import Redirect from 'navigation/components/Redirect';

import Terms from './terms/components/View';
import I2 from './i2-survey/components/View';
import I2Survey from './i2-survey/components/Survey';

export default function View () {
	return (
		<Locations contextual>
			<Location path="/tos(/*)" handler={Terms} />
			<Location path="/i2(/*)" handler={I2} />
			<Location path="/i2-survey(/*)" handler={I2Survey} />

			<DefaultRoute handler={Redirect} location="/" />
		</Locations>
	);
}
