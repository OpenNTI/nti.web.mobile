import {join} from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import {decodeFromURI} from '@nti/lib-ntiids';

import {Component as ContextContributor} from 'common/mixins/ContextContributor';

import ContentViewer from '../shared/AssignmentViewer';

import Header from './AssignmentViewStudentHeader';

export default class AssignmentViewStudent extends React.Component {

	static propTypes = {
		userId: PropTypes.string.isRequired,
		rootId: PropTypes.string.isRequired
	}

	attachContextProvider = x => this.contextProvider = x

	resolveContext (...args) {
		return this.contextProvider.resolveContext(...args);
	}

	makeHref (...args) {
		return this.contextProvider ? this.contextProvider.makeHref(...args) : null;
	}

	render () {
		const {rootId, userId} = this.props;
		const assignmentId = decodeFromURI(rootId);
		const user = decodeURIComponent(userId);

		return (
			<div className="assignment-view-student">
				<ContextContributor ref={this.attachContextProvider} getContext={getContext} {...this.props}>
					<Header {...this.props}
						userId={user}
						assignmentId={assignmentId}
					/>
					<ContentViewer {...this.props}
						userId={user}
						assignmentId={assignmentId}
						explicitContext={this}
					/>
				</ContextContributor>
			</div>
		);
	}
}

async function getContext () {
	const context = this;//this will be called with the ContextContributor's context ("this")
	const {rootId, userId} = context.props;
	return {
		label: decodeURIComponent(userId),
		ntiid: decodeFromURI(rootId),
		href: context.makeHref(join(rootId, userId, '/'))
	};
}
