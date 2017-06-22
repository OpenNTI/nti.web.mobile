import React from 'react';
import PropTypes from 'prop-types';

import {isAssignment, isSurvey, areAssessmentsSupported} from '../utils';

import AssignmentHeader from './HeaderAssignment';
import ScoreboardHeader from './HeaderScoreboard';
import SurveyHeader from './HeaderSurvey';
import UnsupportedPlaceholder from './UnsupportedPlaceholder';


export default function SetHeader ({assessment}) {
	let Component = isAssignment(assessment)
		? AssignmentHeader
		: isSurvey(assessment)
			? SurveyHeader
			: ScoreboardHeader;

	if (!areAssessmentsSupported()) {
		return (
			<UnsupportedPlaceholder assignment={assessment}/>
		);
	}

	return (
		<Component assessment={assessment}/>
	);
}

SetHeader.propTypes = {
	assessment: PropTypes.object
};
