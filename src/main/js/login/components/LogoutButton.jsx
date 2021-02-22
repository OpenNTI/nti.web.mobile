import React from 'react';

import Button from 'forms/components/Button';

import { logout } from '../Actions';

export default function LogoutButton() {
	return (
		<Button className="logout" onClick={logout}>
			Log Out
		</Button>
	);
}
