import React from 'react';

import {registerOptOutTestHandler} from 'common/utils/iframe-buster';

import { Locations, Location, NotFound as DefaultRoute } from 'react-router-component';
import Redirect from 'navigation/components/Redirect';

import Terms from './terms/components/View';
import I2Survey from './i2-survey/components/View';

//Tell the iframe-buster to stop if the location is on the i2-survey page.
registerOptOutTestHandler(() => /i2\-survey/.test(location.href));

export default function View () {
	return (
		<Locations contextual>
			<Location path="/tos(/*)" handler={Terms} />
			<Location path="/i2-survey(/*)" handler={I2Survey} />

			<DefaultRoute handler={Redirect} location="/" />
		</Locations>
	);
}
