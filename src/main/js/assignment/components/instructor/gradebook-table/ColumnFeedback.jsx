import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
    static displayName = 'GradebookColumnFeedback';

    static label() {
        return 'Feedback';
    }

    static className = 'col-feedback';
    static sort = 'feedbackCount';

    static propTypes = {
		item: PropTypes.object.isRequired // UserGradeBookSummary object
	};

    render() {

		const {props: {item: {HistoryItemSummary: item}}} = this;

		return (
			<div>{item && item.feedbackCount > 0 && item.feedbackCount}</div>
		);
	}
}
