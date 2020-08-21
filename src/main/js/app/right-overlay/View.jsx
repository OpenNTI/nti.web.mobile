import './View.scss';
import React from 'react';

import Impersonate from './Impersonate';
import UserCard from './UserCard';
import Tabs from './tabs';

export default function View () {
	return (
		<div className="nti-mobile-right-overlay">
			<Impersonate />
			<UserCard />
			<Tabs />
		</div>
	);
}
