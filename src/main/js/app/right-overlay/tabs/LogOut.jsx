import './LogOut.scss';

import { Button } from '@nti/web-core';
import { logout } from 'internal/login/Actions';

export default function LogOut(props) {
	return (
		<Button className="logout-button" onClick={logout}>
			Log Out
		</Button>
	);
}
