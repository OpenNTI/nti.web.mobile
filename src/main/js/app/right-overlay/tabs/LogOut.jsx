import './LogOut.scss';
import React from 'react';

import { Button } from '@nti/web-commons';
import { logout } from 'internal/login/Actions';

export default function LogOut(props) {
	return (
		<Button className="logout-button" onClick={logout}>
			Log Out
		</Button>
	);
}
