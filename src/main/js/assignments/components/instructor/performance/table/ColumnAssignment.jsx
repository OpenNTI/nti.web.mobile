import React from 'react';

import {encodeForURI} from 'nti-lib-interfaces/lib/utils/ntiids';

export default React.createClass({
	displayName: 'GradebookColumnAssignment',

	statics: {
		label () {
			return 'Assignment';
		},
		className: 'col-assignment',
		sort: 'title'
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {

		const {item} = this.props;

		const href = encodeForURI(item.assignmentId);

		return (
			<a href={href}>{item.title}</a>
		);
	}
});
