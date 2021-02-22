import PropTypes from 'prop-types';
import React from 'react';

import ActionsMenu from '../ActionsMenu';

export default class GradebookColumnActions extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired, // UserGradeBookSummary object
	};

	static label = () => '';
	static className = 'col-actions';
	static sort = '';

	render() {
		const { item } = this.props;
		if (!item.grade) {
			return null;
		}

		return <ActionsMenu {...this.props} userId={item.username} />;
	}
}
