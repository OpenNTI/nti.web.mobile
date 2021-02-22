import './ColumnFeedback.scss';
import PropTypes from 'prop-types';
import React from 'react';

export default class GradebookColumnFeedback extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired, // UserGradeBookSummary object
	};

	static label = () => 'Feedback';
	static className = 'col-feedback';
	static sort = 'feedbackCount';

	render() {
		const {
			props: {
				item: { HistoryItemSummary: item },
			},
		} = this;

		return (
			<div>{item && item.feedbackCount > 0 && item.feedbackCount}</div>
		);
	}
}
