import React from 'react';

import {logout} from '../Actions';
import Button from 'common/forms/components/Button';

export default function LogoutButton () {
	return (
		<Button className="logout" onClick={logout}>Log Out</Button>
	);
}
