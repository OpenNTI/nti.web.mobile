import React from 'react';

import {logout} from '../Actions';
import Button from 'common/forms/components/Button';

export default React.createClass({
	displayName: 'LogoutButton',

	render () {
		return (
			<Button className="logout" onClick={logout}>Log Out</Button>
		);
	}
});
