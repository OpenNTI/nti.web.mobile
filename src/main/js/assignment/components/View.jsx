import React from 'react';
import PropTypes from 'prop-types';
import { decorate } from '@nti/lib-commons';
import { Loading } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { Component as ContextContributor } from 'common/mixins/ContextContributor';

import AssignmentsProvider from './bindings/AssignmentsProvider';
import Student from './student/View';
import Instructor from './instructor/View';

const t = scoped('nti-web-mobile.assignment.components.View', {
	label: 'Assignments',
});

class AssignmentsView extends React.Component {
	static propTypes = {
		assignments: PropTypes.object,
		course: PropTypes.object,
		loading: PropTypes.bool,
	};

	render() {
		const { assignments, course, loading } = this.props;

		if (loading) {
			return <Loading.Mask />;
		}

		const isAdministrative = /administrative/.test(
			course.PreferredAccess && course.PreferredAccess.MimeType
		);

		const Comp =
			isAdministrative && course.GradeBook ? Instructor : Student;

		return (
			<ContextContributor getContext={getContext}>
				<Comp {...this.props} assignments={assignments} />
			</ContextContributor>
		);
	}
}

async function getContext() {
	const context = this; //this will be called with the ContextContributor's context ("this")

	return {
		href: context.makeHref('/assignments/'),
		label: t('label'),
	};
}

export default decorate(AssignmentsView, [AssignmentsProvider.connect]);
