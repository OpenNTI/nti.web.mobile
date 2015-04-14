import React from 'react';

import Actions from '../Actions';
import Button from 'common/forms/components/Button';

export default React.createClass({
	displayName: 'LogoutButton',

	render () {
		return (
			<Button className="logout" onClick={Actions.logOut}>Log Out</Button>
		);
	}
});
