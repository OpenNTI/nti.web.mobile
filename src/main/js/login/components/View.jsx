import React from 'react';

import Redirect from 'navigation/components/Redirect';

export default function LoginView () {
	return (
		<Redirect location="/login/" force />
	);
}

