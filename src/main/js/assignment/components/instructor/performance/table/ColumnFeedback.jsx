import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
	static displayName = 'performance:ColumnFeedback';

	static label() {
		return 'Feedback';
	}

	static className = 'col-feedback';
	static sort = 'feedbackCount';

	static propTypes = {
		item: PropTypes.object.isRequired,
	};

	render() {
		const { item } = this.props;

		return <div>{item.feedbackCount > 0 && item.feedbackCount}</div>;
	}
}
