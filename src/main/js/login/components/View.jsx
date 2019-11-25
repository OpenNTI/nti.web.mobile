import React from 'react';

import Redirect from 'navigation/components/Redirect';

export default function LoginView () {
	const href = global.location?.href;
	const url = new URL(href);
	const returnParam = url.searchParams.get('return');

	let redirect = '/login/';

	if (returnParam) {
		redirect = `${redirect}?return=${encodeURIComponent(returnParam)}`;
	}

	return (
		<Redirect location={redirect} force />
	);
}

