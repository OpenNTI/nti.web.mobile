import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from '@nti/web-commons';
import {decodeFromURI, encodeForURI} from '@nti/lib-ntiids';

import AssignmentsProvider from 'assignment/components/bindings/AssignmentsProvider';
import AssignmentView from 'assignment/components/shared/Assignments';
import {Component as ContextContributor} from 'common/mixins/ContextContributor';

// import Student from './student/View';
// import Instructor from './instructor/View';


const courseHref = (currPath) => {
	return currPath.substring(0, currPath.indexOf('/assignment/'));
};

export default
@AssignmentsProvider.connect
class Assignment extends React.Component {

	static propTypes = {
		assignments: PropTypes.object,
		course: PropTypes.object,
		loading: PropTypes.bool,
	}

	getContext () {
		let {outlineId, course} = this.props.children.props;
		let {router} = this.context;

		let id = decodeFromURI(outlineId);
		return course.getOutlineNode(id)
			.then(node=>({
				ntiid: id,
				label: node.label,
				// ref: node.ref,
				scope: node,//for UGD
				href: courseHref(router.getEnvironment().getPath())
			}),
			//error
			() => {
				// logger.warn('Could not find outline node: %s in course: ', id, course.getID());
			});
	}

	render () {
		const {
			assignments,
			// course,
			loading,
		} = this.props;

		if(loading) {
			return ( <Loading.Mask /> );
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
