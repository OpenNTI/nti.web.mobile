import React from 'react';
import PropTypes from 'prop-types';
import { encodeForURI } from '@nti/lib-ntiids';
import { decorate } from '@nti/lib-commons';
import { Loading } from '@nti/web-commons';

import AssignmentsProvider from 'assignment/components/bindings/AssignmentsProvider';
import AssignmentViewer from 'assignment/components/shared/AssignmentViewer';

import Page from '../Page';
import Registry from '../Registry';

function getAssignmentId(location) {
	const { item } = location || {};

	return item && (item.target || item.getID());
}

const MIME_TYPES = {
	'application/vnd.nextthought.assessment.discussionassignment': true,
	'application/vnd.nextthought.assessment.timedassignment': true,
	'application/vnd.nextthought.assessment.assignment': true,
	'application/vnd.nextthought.assignmentref': true,
};

const handles = obj => {
	const { location } = obj || {};
	const { item } = location || {};

	return item && MIME_TYPES[item.MimeType];
};

class CourseItemAssignment extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		location: PropTypes.object,

		loading: PropTypes.bool,
		assignments: PropTypes.object,
	};

	render() {
		const { location, course, loading, assignments } = this.props;
		const assignmentId = getAssignmentId(location);

		return (
			<Page {...this.props}>
				{loading && <Loading.Spinner.Large />}
				{!loading && (
					<AssignmentViewer
						course={course}
						assignments={assignments}
						rootId={encodeForURI(assignmentId)}
					/>
				)}
			</Page>
		);
	}
}

export default decorate(CourseItemAssignment, [
	Registry.register(handles),
	AssignmentsProvider.connect,
]);
