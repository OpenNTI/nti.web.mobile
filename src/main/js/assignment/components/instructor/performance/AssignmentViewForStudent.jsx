import {join} from 'path';

import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {Component as ContextContributor} from 'common/mixins/ContextContributor';

import AssignmentViewer from '../AssignmentViewerWrapper';

export default class AssignmentViewForStudentPerformance {

	static propTypes = {
		userId: PropTypes.string
	}

	render () {
		return (
			<Fragment>
				<ContextContributor getContext={getContext} {...this.props}/>
				<AssignmentViewer {...this.props} />
			</Fragment>
		);
	}
}

async function getContext () {
	const context = this;//this will be called with the ContextContributor's context ("this")
	const {userId} = context.props;
	return {
		label: 'Assignments',
		href: context.makeHref(join('performance', userId, '/') )
	};
}
