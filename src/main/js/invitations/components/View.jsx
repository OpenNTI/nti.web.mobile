import React from 'react';
import { Locations, Location } from 'react-router-component';

import PageFrame from 'common/components/Page';
import Redeem from './Redeem';

export default React.createClass({
	displayName: 'Invitations:View',

	render () {
		return (
			<Locations contextual>
				<Location path="/redeem/(:code)(/*)" handler={PageFrame} pageContent={Redeem} />
			</Locations>
		);
	}
});
