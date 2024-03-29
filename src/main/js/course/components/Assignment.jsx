import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { Loading } from '@nti/web-commons';
import { decodeFromURI } from '@nti/lib-ntiids';
import AssignmentsProvider from 'internal/assignment/components/bindings/AssignmentsProvider';
import AssignmentView from 'internal/assignment/components/shared/Assignments';
import { Component as ContextContributor } from 'internal/common/mixins/ContextContributor';

// import Student from './student/View';
// import Instructor from './instructor/View';

const courseHref = currPath => {
	return currPath.substring(0, currPath.indexOf('/assignment/'));
};

class Assignment extends React.Component {
	static propTypes = {
		assignments: PropTypes.object,
		children: PropTypes.shape({
			props: PropTypes.shape({
				outlineId: PropTypes.string,
				course: PropTypes.object,
			}),
		}),
		loading: PropTypes.bool,
	};

	getContext() {
		let {
			children: {
				props: { outlineId, course },
			},
		} = this.props;

		let { router } = this.context;

		let id = decodeFromURI(outlineId);
		return course.getOutlineNode(id).then(
			node => ({
				ntiid: id,
				label: node.label,
				// ref: node.ref,
				scope: node, //for UGD
				href: courseHref(router.getEnvironment().getPath()),
			}),
			//error
			() => {
				// logger.warn('Could not find outline node: %s in course: ', id, course.getID());
			}
		);
	}

	render() {
		const {
			assignments,
			// course,
			loading,
		} = this.props;

		if (loading) {
			return <Loading.Mask />;
		}

		// const isAdministrative = /administrative/.test(course.PreferredAccess && course.PreferredAccess.MimeType);

		// const Comp = isAdministrative && course.GradeBook
		// 	? Instructor
		// 	: Student;

		return (
			<ContextContributor getContext={this.getContext}>
				<AssignmentView {...this.props} assignments={assignments} />
			</ContextContributor>
		);
	}
}

export default decorate(Assignment, [AssignmentsProvider.connect]);
