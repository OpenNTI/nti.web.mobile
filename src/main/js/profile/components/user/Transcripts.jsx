import './Transcripts.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { User } from '@nti/web-profiles';

const { Transcripts } = User;

ProfileTranscripts.propTypes = {
	entity: PropTypes.object,
};
export default function ProfileTranscripts({ entity }) {
	return entity ? (
		<div className="profile-transcripts-container">
			<Transcripts entity={entity} />
		</div>
	) : null;
}
