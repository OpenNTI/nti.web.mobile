import { join } from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import { Component as ContextContributor } from 'common/mixins/ContextContributor';

import AssignmentViewer from '../AssignmentViewerWrapper';

const t = scoped(
	'nti-web-mobile.assignment.components.instructor.performance.AssignmentViewForStudent',
	{
		label: 'Assignments',
	}
);

export default class AssignmentViewForStudentPerformance extends React.Component {
	static propTypes = {
		userId: PropTypes.string,
	};

	render() {
		return (
			<ContextContributor getContext={getContext} {...this.props}>
				<AssignmentViewer {...this.props} />
			</ContextContributor>
		);
	}
}

async function getContext() {
	const context = this; //this will be called with the ContextContributor's context ("this")
	const { userId } = context.props;
	return {
		label: t('label'),
		href: context.makeHref(join('performance', userId, '/')),
	};
}
