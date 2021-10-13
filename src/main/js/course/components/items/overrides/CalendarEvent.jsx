import PropTypes from 'prop-types';

import { Event } from '@nti/web-calendar';
import { Content } from '@nti/web-course';

import Registry from './Registry';

const MIME_TYPES = {
	'application/vnd.nextthought.nticalendareventref': true,
};

const styles = stylesheet`
	.padding {
		padding: 10px;
	}
`;

// because this overrides the course view wrapper we have to duplicate this nonsense here too
const View = styled(Event.View)`
	& :global(.calendar-event-editor) {
		width: auto;
	}

	[event-details-header] {
		display: none;
	}
`;

const handles = obj => {
	const { location } = obj || {};
	const { item } = location || {};

	return item && MIME_TYPES[item.MimeType];
};

CourseItemCalendarEvent.propTypes = {
	location: PropTypes.shape({
		item: PropTypes.object,
	}),
};
export default function CourseItemCalendarEvent({ location: { item } = {} }) {
	const Header = Content.HeaderRegistry.lookup(item);
	return (
		<>
			{Header && <Header item={item} className={styles.padding} />}
			<View event={item?.CalendarEvent} dialog={false} controls={false} />
		</>
	);
}

Registry.register(handles)(CourseItemCalendarEvent);
