import { Locations, Location, NotFound } from 'react-router-component';

import Calendar from 'internal/calendar';

import DialogRouteHandler from './DialogRouteHandler';

const NoOp = () => null;
const onBeforeDismiss = () => null; //closeDialog();

export default function DialogsRouter(props) {
	const childProps = {
		onBeforeDismiss,
		...props,
	};

	return (
		<Locations
			hash
			component={null}
			urlPatternOptions={{ segmentValueCharset: "a-zA-Z0-9-_ %.:(),'" }}
			childProps={childProps}
		>
			<Location
				path="/calendar(/:eventId)(/*)"
				handler={DialogRouteHandler}
				component={Calendar}
			/>
			<NotFound handler={NoOp} />
		</Locations>
	);
}
