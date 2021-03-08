import React from 'react';

import Redirect from 'internal/navigation/components/Redirect';

export default function LoginView() {
	const href = global.location?.href;
	const url = new URL(href);
	const returnParam = url.searchParams.get('return') || '/mobile';

	let redirect = `/login/?return=${encodeURIComponent(returnParam)}`;

	return <Redirect location={redirect} force />;
}
