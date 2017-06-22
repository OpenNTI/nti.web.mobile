import React from 'react';
import PropTypes from 'prop-types';

import TopicView from 'forums/components/TopicView';

export default function BlogEntryDetail ({id}) {
	return (
		<div className="profile-forums forums-wrapper">
			<TopicView topicId={id} />
		</div>
	);
}

BlogEntryDetail.propTypes = {
	id: PropTypes.string.isRequired
};
