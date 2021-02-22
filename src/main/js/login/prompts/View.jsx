import React from 'react';
import {
	Locations,
	Location,
	NotFound as DefaultRoute,
} from 'react-router-component';

import Redirect from 'navigation/components/Redirect';

import Terms from './terms/components/View';
import Survey from './survey/components/View';
import Update from './update/View';

export default function View() {
	return (
		<Locations contextual>
			<Location path="/tos(/*)" handler={Terms} />
			<Location path="/survey(/*)" handler={Survey} />
			<Location path="/i2-survey(/*)" handler={Survey} />
			<Location path="/update(/*)" handler={Update} />

			<DefaultRoute handler={Redirect} location="/" absolute />
		</Locations>
	);
}
