import React from 'react';
import {Link} from 'react-router-component';
import {scoped} from 'nti-lib-locale';

let t = scoped('LOGIN');

export default function RecoveryLinks () {
	let username = {
		id: 'login:forgot:username',
		href: '/forgot/username',
		children: t('forgot.username')
	};

	let password = {
		id: 'login:forgot:password',
		href: '/forgot/password',
		children: t('forgot.password')
	};

	return (
		<div className="recovery-links">
			I forgot my	<Link {...username}/> or <Link {...password}/>.
		</div>
	);
}
