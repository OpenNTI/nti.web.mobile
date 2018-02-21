import {join} from 'path';

import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {decodeFromURI} from 'nti-lib-ntiids';

import {Component as ContextContributor} from 'common/mixins/ContextContributor';

import AssignmentViewer from './AssignmentViewerWrapper';

export default class AssignmentViewForStudent {
	static propTypes = {
		rootId: PropTypes.string
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
	const {rootId} = context.props;
	return {
		label: 'Students',
		ntiid: decodeFromURI(rootId),
		href: context.makeHref(join(rootId, '/students/'))
	};
}
