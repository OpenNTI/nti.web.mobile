import React, { Suspense } from 'react';
import { Loading } from '@nti/web-commons';

const View = React.lazy(() =>
	import(/* webpackChunkName: "community" */ './Routes')
);

export default function Loader(props) {
	return (
		<Suspense fallback={<Loading.Mask />}>
			<View {...props} />
		</Suspense>
	);
}
