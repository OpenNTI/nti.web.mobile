import PropTypes from 'prop-types';
import React from 'react';

import GradeBox from '../GradeBox';

export default class GradebookColumnScore extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired, // UserGradeBookSummary object
		assignmentId: PropTypes.string.isRequired
	}

	static label = () => 'Score'
	static className = 'col-score'
	static sort = 'Grade'


	render () {

		const {props: {item: {HistoryItemSummary}}} = this;
		const {grade} = HistoryItemSummary || {};

		return (
			<div>
				<GradeBox
					grade={grade}
					assignmentId={this.props.assignmentId}
					userId={this.props.item.user.getID()}
				/>
			</div>
		);
	}
}
