import React from 'react';
import { Locations, Location, NotFound } from 'react-router-component';

import Redirect from 'navigation/components/Redirect';
import PageFrame from 'common/components/Page';
import Redeem from './Redeem';

export default React.createClass({
	displayName: 'Invitations:View',

	render () {
		return (
			<Locations contextual>
				<Location path="/redeem/(:code)(/*)" handler={PageFrame} pageContent={Redeem} />
				<NotFound handler={Redirect} location="/redeem/" />
			</Locations>
		);
	}
});
