import PropTypes from 'prop-types';

import TopicView from 'internal/forums/components/TopicView';

export default function BlogEntryDetail({ id }) {
	return (
		<div className="profile-forums forums-wrapper">
			<TopicView topicId={id} />
		</div>
	);
}

BlogEntryDetail.propTypes = {
	id: PropTypes.string.isRequired,
};
