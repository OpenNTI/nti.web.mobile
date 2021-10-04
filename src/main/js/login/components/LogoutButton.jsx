import React from 'react';

import { Button } from '@nti/web-core';

import { logout } from '../Actions';

export default function LogoutButton() {
	return (
		<Button className="logout" onClick={logout}>
			Log Out
		</Button>
	);
}
