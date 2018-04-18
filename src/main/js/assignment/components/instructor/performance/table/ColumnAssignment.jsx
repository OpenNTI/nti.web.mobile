import React from 'react';
import PropTypes from 'prop-types';
import {encodeForURI} from '@nti/lib-ntiids';

export default class extends React.Component {
	static displayName = 'GradebookColumnAssignment';

	static label () {
		return 'Assignment';
	}

	static className = 'col-assignment';
	static sort = 'title';

	static propTypes = {
		item: PropTypes.object.isRequired
	};

	render () {

		const {item} = this.props;

		const href = encodeForURI(item.assignmentId);

		return (
			<a href={href}>{item.title}</a>
		);
	}
}
