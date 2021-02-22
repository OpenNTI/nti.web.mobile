import React from 'react';
import PropTypes from 'prop-types';

import { isAssignment, isSurvey, areAssessmentsSupported } from '../utils';

import AssignmentHeader from './HeaderAssignment';
import ScoreboardHeader from './HeaderScoreboard';
import SurveyHeader from './HeaderSurvey';
import UnsupportedPlaceholder from './UnsupportedPlaceholder';

export default function SetHeader({ assessment, onTryAgain }) {
	let Component = isAssignment(assessment)
		? AssignmentHeader
		: isSurvey(assessment)
		? SurveyHeader
		: ScoreboardHeader;

	if (!areAssessmentsSupported()) {
		return <UnsupportedPlaceholder assignment={assessment} />;
	}

	return <Component assessment={assessment} onTryAgain={onTryAgain} />;
}

SetHeader.propTypes = {
	assessment: PropTypes.object,
	onTryAgain: PropTypes.func,
};
