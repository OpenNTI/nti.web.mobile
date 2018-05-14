import React from 'react';
import PropTypes from 'prop-types';
import {Transcripts} from '@nti/web-profiles';


ProfileTranscripts.propTypes = {
	entity: PropTypes.object
};
export default function ProfileTranscripts ({entity}) {
	return entity ? (<Transcripts entity={entity} />) : null;
}
