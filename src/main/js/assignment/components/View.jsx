import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Loading} from 'nti-web-commons';

import {Component as ContextContributor} from 'common/mixins/ContextContributor';

import AssignmentsProvider from './bindings/AssignmentsProvider';
import Student from './student/View';
import Instructor from './instructor/View';


export default
@AssignmentsProvider.connect
class AssignmentsView extends React.Component {

	static propTypes = {
		assignments: PropTypes.object,
		course: PropTypes.object,
		loading: PropTypes.bool,
	}

	render () {
		const {
			assignments,
			course,
			loading,
		} = this.props;

		if(loading) {
			return ( <Loading.Mask /> );
		}

		const Comp = course.isAdministrative && course.GradeBook
			? Instructor
			: Student;

		return (
			<Fragment>
				<ContextContributor getContext={getContext}/>
				<Comp {...this.props} assignments={assignments} />
			</Fragment>
		);

	}
}

async function getContext () {
	const context = this;//this will be called with the ContextContributor's context ("this")

	return {
		href: context.makeHref('/assignments/'),
		label: 'Assignments'
	};
}
