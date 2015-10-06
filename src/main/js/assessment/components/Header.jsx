import React from 'react';

import AssignmentHeader from './HeaderAssignment';
import ScoreboardHeader from './HeaderScoreboard';
import SurveyHeader from './HeaderSurvey';
import UnsupportedPlaceholder from './UnsupportedPlaceholder';

import {isAssignment, isSurvey, areAssessmentsSupported} from '../Utils';

export default React.createClass({
	displayName: 'SetHeader',

	propTypes: {
		assessment: React.PropTypes.object
	},

	render () {
		let {assessment} = this.props;
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
});
