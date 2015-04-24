import React from 'react';

import AssignmentHeader from './HeaderAssignment';
import ScoreboardHeader from './HeaderScoreboard';
import UnsupportedPlaceholder from './UnsupportedPlaceholder';

import {isAssignment, areAssessmentsSupported} from '../Utils';

export default React.createClass({
	displayName: 'SetHeader',

	propTypes: {
		assessment: React.PropTypes.string
	},

	render () {
		let {assessment} = this.props;
		let Component = isAssignment(assessment) ?
						AssignmentHeader : ScoreboardHeader;

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
