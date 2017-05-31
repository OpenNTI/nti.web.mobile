import PropTypes from 'prop-types';
import React from 'react';

import ActionsMenu from '../ActionsMenu';

export default class extends React.Component {
	static displayName = 'GradebookColumnActions';

	static label () {
		return '';
	}

	static className = 'col-actions';
	static sort = '';

	static propTypes = {
		item: PropTypes.object.isRequired // UserGradeBookSummary object
	};

	render () {

		const {item} = this.props;
		if(!item.grade) {
			return null;
		}

		return (
			<ActionsMenu {...this.props} userId={item.username} />
		);
	}
}
