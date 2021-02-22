import React from 'react';
import PropTypes from 'prop-types';

import StudentLink from './StudentLink';

export default class GradebookColumnStudent extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired, // UserGradeBookSummary object
	};

	static label = () => 'Student';
	static className = 'col-student';
	static sort = 'LastName';

	render() {
		return <StudentLink item={this.props.item} />;
	}
}
