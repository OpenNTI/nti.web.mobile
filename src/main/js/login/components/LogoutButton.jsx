import React from 'react';

import {logOut} from '../Actions';
import Button from 'common/forms/components/Button';

export default React.createClass({
	displayName: 'LogoutButton',

	render () {
		return (
			<Button className="logout" onClick={logOut}>Log Out</Button>
		);
	}
});
