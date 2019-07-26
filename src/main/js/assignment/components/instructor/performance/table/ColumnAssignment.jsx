import React from 'react';
import PropTypes from 'prop-types';
import {encodeForURI} from '@nti/lib-ntiids';
import {scoped} from '@nti/lib-locale';

const t = scoped('nt-web-mobile.assignment.components.instructor.performance.table.ColumnAssignment', {
	label: 'Assignment'
});

export default class extends React.Component {
	static displayName = 'GradebookColumnAssignment';

	static label () {
		return t('label');
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
