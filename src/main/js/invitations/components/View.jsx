import React from 'react';
import { Locations, Location, NotFound } from 'react-router-component';

import Redirect from 'navigation/components/Redirect';
import PageFrame from 'common/components/Page';
import Accept from './Accept';
import Send from './Send';

export default React.createClass({
	displayName: 'Invitations:View',

	render () {
		return (
			<Locations contextual>
				<Location path="/accept/(:code)(/*)" handler={PageFrame} pageContent={Accept} />
				<Location path="/send/(:courseId)(/*)" handler={PageFrame} pageContent={Send} />
				<NotFound handler={Redirect} location="/redeem/" />
			</Locations>
		);
	}
});
