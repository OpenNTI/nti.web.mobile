import { Suspense } from 'react';
import PropTypes from 'prop-types';

import { decodeFromURI } from '@nti/lib-ntiids';
import { Event } from '@nti/web-calendar';
import { Loading } from '@nti/web-commons';
import { NTObject } from '@nti/web-core';

EventView.propTypes = {
	eventId: PropTypes.string,
};
export default function EventView({ eventId }) {
	const goBack = () => {
		window.history.back();
	};

	return (
		<Suspense fallback={<Loading.Spinner />}>
			<NTObject prop="event" id={decodeFromURI(eventId)}>
				<Event.View onCancel={goBack} onSuccess={goBack} />
			</NTObject>
		</Suspense>
	);
}
